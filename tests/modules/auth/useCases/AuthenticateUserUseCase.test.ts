import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hash } from "bcryptjs";
import { AuthenticateUserUseCase } from "../../../../src/modules/auth/useCases/AuthenticateUserUseCase";
import {
  InMemoryUserRepository,
  InMemoryUserTokenRepository,
} from "../../../helpers/inMemoryRepositories";

describe("AuthenticateUserUseCase", () => {
  it("authenticates a user and stores a refresh token", async (t) => {
    t.mock.timers.enable({
      apis: ["Date"],
      now: new Date("2026-04-24T12:00:00.000Z"),
    });
    t.after(() => {
      t.mock.timers.reset();
    });

    const usersRepository = new InMemoryUserRepository();
    const userTokenRepository = new InMemoryUserTokenRepository();
    usersRepository.users = [
      {
        id: "user-1",
        name: "Danilo Lima",
        email: "danilo@example.com",
        password: await hash("123456", 8),
      },
    ];
    const sut = new AuthenticateUserUseCase(
      usersRepository,
      userTokenRepository,
    );

    const result = await sut.execute({
      email: "danilo@example.com",
      password: "123456",
    });

    assert.equal(result.user.name, "Danilo Lima");
    assert.equal(result.user.email, "danilo@example.com");
    assert.match(
      result.refresh_token,
      /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
    );
    assert.equal(userTokenRepository.tokens.length, 1);
    assert.equal(userTokenRepository.tokens[0]?.userId, "user-1");
    assert.equal(
      userTokenRepository.tokens[0]?.refresh_token,
      result.refresh_token,
    );
    assert.equal(
      userTokenRepository.tokens[0]?.expires_date.getTime(),
      new Date("2026-05-24T12:00:00.000Z").getTime(),
    );
  });

  it("throws when the user email does not exist", async () => {
    const usersRepository = new InMemoryUserRepository();
    const userTokenRepository = new InMemoryUserTokenRepository();
    const sut = new AuthenticateUserUseCase(
      usersRepository,
      userTokenRepository,
    );

    await assert.rejects(
      () =>
        sut.execute({
          email: "missing@example.com",
          password: "123456",
        }),
      /email or password is incorrect!/,
    );
  });

  it("throws when the password is invalid", async () => {
    const usersRepository = new InMemoryUserRepository();
    const userTokenRepository = new InMemoryUserTokenRepository();
    usersRepository.users = [
      {
        id: "user-1",
        name: "Danilo Lima",
        email: "danilo@example.com",
        password: await hash("123456", 8),
      },
    ];
    const sut = new AuthenticateUserUseCase(
      usersRepository,
      userTokenRepository,
    );

    await assert.rejects(
      () =>
        sut.execute({
          email: "danilo@example.com",
          password: "wrong-password",
        }),
      /email or password is incorrect!/,
    );
  });
});

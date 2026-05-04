import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compare } from "bcryptjs";
import { CreateUserUseCase } from "../../../../src/modules/users/useCases/CreateUserUseCase";
import { DeleteUserUseCase } from "../../../../src/modules/users/useCases/DeleteUserUseCase";
import { ListUserUseCase } from "../../../../src/modules/users/useCases/ListUserUseCase";
import { UpdateUserUseCase } from "../../../../src/modules/users/useCases/UpdateUserUseCase";
import { InMemoryUserRepository } from "../../../helpers/inMemoryRepositories";

describe("User use cases", () => {
  it("hashes the password before creating a user", async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new CreateUserUseCase(usersRepository);

    const createdUser = await sut.execute({
      name: "Danilo Lima",
      email: "danilo@example.com",
      password: "123456",
    });

    assert.ok(createdUser);
    assert.equal(usersRepository.createdPayloads.length, 1);
    assert.notEqual(usersRepository.createdPayloads[0]?.password, "123456");
    assert.equal(
      await compare("123456", usersRepository.createdPayloads[0]!.password),
      true,
    );
    assert.equal(createdUser.password, usersRepository.createdPayloads[0]!.password);
  });

  it("lists all users returned by the repository", async () => {
    const usersRepository = new InMemoryUserRepository();
    usersRepository.users = [
      {
        id: "user-1",
        name: "Danilo Lima",
        email: "danilo@example.com",
        password: "hash-1",
      },
      {
        id: "user-2",
        name: "Maria Souza",
        email: "maria@example.com",
        password: "hash-2",
      },
    ];
    const sut = new ListUserUseCase(usersRepository);

    const users = await sut.execute();

    assert.deepEqual(users, usersRepository.users);
  });

  it("updates an existing user", async () => {
    const usersRepository = new InMemoryUserRepository();
    usersRepository.users = [
      {
        id: "user-1",
        name: "Danilo Lima",
        email: "danilo@example.com",
        password: "hash-1",
      },
    ];
    const sut = new UpdateUserUseCase(usersRepository);

    const updatedUser = await sut.execute({
      id: "user-1",
      name: "Danilo Silva",
      email: "danilo.silva@example.com",
    });

    assert.equal(updatedUser.name, "Danilo Silva");
    assert.equal(updatedUser.email, "danilo.silva@example.com");
    assert.equal(updatedUser.password, "hash-1");
    assert.equal(usersRepository.updatedPayloads.length, 1);
  });

  it("throws when trying to update a user that does not exist", async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new UpdateUserUseCase(usersRepository);

    await assert.rejects(
      () =>
        sut.execute({
          id: "missing-user",
          name: "Danilo Silva",
          email: "danilo.silva@example.com",
        }),
      /User not found/,
    );
  });

  it("deletes an existing user", async () => {
    const usersRepository = new InMemoryUserRepository();
    usersRepository.users = [
      {
        id: "user-1",
        name: "Danilo Lima",
        email: "danilo@example.com",
        password: "hash-1",
      },
    ];
    const sut = new DeleteUserUseCase(usersRepository);

    await sut.execute("user-1");

    assert.equal(usersRepository.deletedIds.length, 1);
    assert.equal(usersRepository.deletedIds[0], "user-1");
    assert.equal(usersRepository.users.length, 0);
  });

  it("throws when trying to delete a user that does not exist", async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new DeleteUserUseCase(usersRepository);

    await assert.rejects(() => sut.execute("missing-user"), /User not found/);
  });
});

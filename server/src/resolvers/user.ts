import { Resolver, InputType, Field, Ctx, Arg, Mutation } from "type-graphql";
import argon2 from 'argon2';
import { User } from "./../entities/user";
import { MyContext } from "./../types";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string

    @Field()
    password: string
}


@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
      @Arg('options') options: UsernamePasswordInput,
      @Ctx() { em } : MyContext
  ) {
      const hased_password = await argon2.hash(options.password);
      const user = em.create(User, { username: options.username, password: hased_password });
      await em.persistAndFlush(user);
      return user;
  }
}
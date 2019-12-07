import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  public readonly username: string;

  @Column()
  public password_hash!: string;

  constructor(username: string) {
    this.username = username;
  }

  /**
   * check password
   *
   * @param password
   * @returns boolean
   */
  public async checkPassword(password: string): Promise<boolean> {
    return password === this.password_hash;
  }

  /**
   * set password
   *
   * @param password
   */
  public async setPassword(password: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.password_hash = password;
  }
}

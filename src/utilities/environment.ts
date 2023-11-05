import { load } from 'https://deno.land/std@0.205.0/dotenv/mod.ts';

export class Environment {
  private static instance: Environment;
  private env: Record<string, string>;

  private constructor() {
    this.env = {};
  }

  public static async getInstance(): Promise<Environment> {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }

    Environment.instance.env = await load();

    return Environment.instance;
  }

  public get(key: string): string | undefined {
    const fromEnv = Deno.env.get(key);
    const fromEnvFile = Environment.instance.env[key];

    if (fromEnv) return fromEnv;
    if (fromEnvFile) return fromEnvFile;

    return undefined;
  }
}

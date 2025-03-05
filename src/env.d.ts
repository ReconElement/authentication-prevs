declare namespace NodeJS{
    export interface ProcessEnv{
        DATABASE_URL: string;
        PORT: string;
        SECRET_KEY: string;
        GITHUB_CLIENT_ID: string;
        GITHUB_CLIENT_SECRET: string;
    }
}

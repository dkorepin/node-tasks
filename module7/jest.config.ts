import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  moduleDirectories: ["<rootDir>/src", "node_modules"],
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};

export default config;
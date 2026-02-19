const config = {
  // verbose: true,
  testEnvironment: 'jsdom',
  testMatch: ['**/spec/**/*Spec.ts', '**/spec/**/*Spec.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    "^.+.tsx?$": ["ts-jest", {
      tsconfig: 'test-tsconfig.json'
    }],
  },
};

export default config;

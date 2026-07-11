import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// Lint contract per the packet manifest and docs/TEST_PLAN.md section 3.5.
// The determinism block makes an engine varying math call inside the simulation
// domain a merge blocking lint error (FR017, NFR010).
const DETERMINISM_FORBIDDEN_MATH = [
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'atan2',
  'exp',
  'expm1',
  'log',
  'log2',
  'log10',
  'log1p',
  'pow',
  'sinh',
  'cosh',
  'tanh',
  'cbrt',
  'random',
].map((name) => ({
  object: 'Math',
  property: name,
  message: `Math.${name} is engine varying or nondeterministic. Route determinism critical math through the sanctioned fixed point helpers in src/utils/math.ts (docs/TEST_PLAN.md 3.5).`,
}));

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'FILTER_BUILD_PACKET/**',
    ],
  },
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  jsxA11y.flatConfigs.recommended,
  {
    files: ['src/simulation/**/*.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        ...DETERMINISM_FORBIDDEN_MATH,
        {
          object: 'Date',
          property: 'now',
          message:
            'Wall clock reads are forbidden in the simulation domain. Playback pacing lives in src/state/simulation_store.ts (docs/TEST_PLAN.md 3.5).',
        },
        {
          object: 'performance',
          property: 'now',
          message:
            'Wall clock reads are forbidden in the simulation domain (docs/TEST_PLAN.md 3.5).',
        },
      ],
      'no-restricted-globals': [
        'error',
        {
          name: 'performance',
          message:
            'Wall clock access is forbidden in the simulation domain (docs/TEST_PLAN.md 3.5).',
        },
      ],
    },
  },
);

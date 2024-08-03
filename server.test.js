// server.test.js
const tailwindVanilla = require('./tailwind-vanilla');

describe('tailwindVanilla', () => {
  it('should process htmlContent with the given prefix', () => {
    const htmlContent = '<div class="text-center"></div>';
    const withPrefix = 'tw-prefix';

    const result = tailwindVanilla(htmlContent, withPrefix);

    expect(result).toContain('.tw-prefix .text-center');
  });
});
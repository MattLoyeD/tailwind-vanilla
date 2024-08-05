// server.test.js
const tailwindVanilla = require('./tailwind-vanilla');

describe('tailwindVanilla', () => {
  it('should process htmlContent with the given prefix', async () => {
    const htmlContent = '<div class="text-center">This is a test</div>';
    const withPrefix = 'tw-prefix';

    const result = await tailwindVanilla(htmlContent, withPrefix);
    
    expect(result.css).toContain('.tw-prefix .text-center');
  });
});
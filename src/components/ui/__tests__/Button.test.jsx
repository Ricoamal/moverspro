import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies default variant styling', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600', 'text-white');
  });

  it('applies outline variant styling', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-gray-300', 'text-gray-700');
  });

  it('applies ghost variant styling', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-gray-600', 'hover:bg-gray-100');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <Button>
        <span data-testid="icon">🏠</span>
        With Icon
      </Button>
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('renders as different element when "as" prop is provided', () => {
    render(<Button as="a" href="/test">Link Button</Button>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('prevents click when loading', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Loading</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(<Button aria-label="Custom label">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label');
  });

  describe('Button variants', () => {
    const variants = [
      { variant: 'default', expectedClasses: ['bg-blue-600', 'text-white'] },
      { variant: 'destructive', expectedClasses: ['bg-red-600', 'text-white'] },
      { variant: 'outline', expectedClasses: ['border-gray-300', 'text-gray-700'] },
      { variant: 'secondary', expectedClasses: ['bg-gray-100', 'text-gray-900'] },
      { variant: 'ghost', expectedClasses: ['text-gray-600'] },
      { variant: 'link', expectedClasses: ['text-blue-600', 'underline-offset-4'] }
    ];

    variants.forEach(({ variant, expectedClasses }) => {
      it(`applies correct styling for ${variant} variant`, () => {
        render(<Button variant={variant}>{variant} Button</Button>);
        const button = screen.getByRole('button');
        
        expectedClasses.forEach(className => {
          expect(button).toHaveClass(className);
        });
      });
    });
  });

  describe('Button sizes', () => {
    const sizes = [
      { size: 'sm', expectedClasses: ['px-3', 'py-1.5', 'text-sm'] },
      { size: 'default', expectedClasses: ['px-4', 'py-2'] },
      { size: 'lg', expectedClasses: ['px-6', 'py-3', 'text-lg'] },
      { size: 'icon', expectedClasses: ['h-10', 'w-10'] }
    ];

    sizes.forEach(({ size, expectedClasses }) => {
      it(`applies correct styling for ${size} size`, () => {
        render(<Button size={size}>{size} Button</Button>);
        const button = screen.getByRole('button');
        
        expectedClasses.forEach(className => {
          expect(button).toHaveClass(className);
        });
      });
    });
  });
});

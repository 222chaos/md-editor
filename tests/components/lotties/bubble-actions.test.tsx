/**
 * 覆盖 bubble-actions 下 More/Play/Quote/Share 及 Abstract active=false 分支
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const mockPlay = vi.fn();
const mockStop = vi.fn();
const mockLottieRef = { play: mockPlay, stop: mockStop };

vi.mock('lottie-react', () => {
  const React = require('react');
  const MockLottie = (props: Record<string, unknown>) => {
    if (props?.lottieRef && typeof props.lottieRef === 'object' && 'current' in props.lottieRef) {
      (props.lottieRef as { current: unknown }).current = mockLottieRef;
    }
    return React.createElement('div', { 'data-testid': 'lottie-mock' });
  };
  return {
    __esModule: true,
    default: MockLottie,
  };
});

import { AbstractLottie } from '../../../src/Components/lotties/bubble-actions/Abstract';
import MoreLottie from '../../../src/Components/lotties/bubble-actions/More';
import PlayLottie from '../../../src/Components/lotties/bubble-actions/Play';
import QuoteLottie from '../../../src/Components/lotties/bubble-actions/Quote';
import ShareLottie from '../../../src/Components/lotties/bubble-actions/Share';

describe('bubble-actions Lottie', () => {
  it('应渲染 MoreLottie', () => {
    render(<MoreLottie />);
    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument();
  });

  it('应渲染 PlayLottie', () => {
    render(<PlayLottie />);
    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument();
  });

  it('应渲染 QuoteLottie', () => {
    render(<QuoteLottie />);
    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument();
  });

  it('应渲染 ShareLottie', () => {
    render(<ShareLottie />);
    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument();
  });

  it('AbstractLottie active=false 时应调用 stop', () => {
    mockStop.mockClear();
    render(<AbstractLottie animationData={{}} active={false} />);
    expect(mockStop).toHaveBeenCalled();
  });
});

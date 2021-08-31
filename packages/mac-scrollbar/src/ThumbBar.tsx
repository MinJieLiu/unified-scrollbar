import React from 'react';
import { classNames, minThumbSize, updateScrollPosition } from './utils';
import type { ActionPosition } from './types';
import './ThumbBar.less';

export interface ThumbBarProps {
  /**
   * @default vertical
   */
  horizontal?: boolean;
  /**
   * @default white
   */
  theme?: 'dark';
  isPress: boolean | undefined;

  grooveRef: React.RefObject<HTMLDivElement>;
  scrollSize: number;
  offsetWidth: number;
  offsetHeight: number;

  updateAction: React.Dispatch<React.SetStateAction<ActionPosition>>;
}

function ThumbBar({
  horizontal,
  isPress,

  grooveRef,
  scrollSize,
  offsetWidth,
  offsetHeight,

  updateAction,
}: ThumbBarProps) {
  const [sizeKey, offsetSize] = horizontal ? ['width', offsetWidth] : ['height', offsetHeight];

  function handleThumbBarClick(e: React.MouseEvent<HTMLDivElement>) {
    const scrollNode = grooveRef.current?.parentNode as HTMLDivElement;
    const { scrollLeft, scrollTop } = scrollNode;
    const scrollPosition = horizontal ? scrollLeft : scrollTop;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickPosition = horizontal
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height;
    const scrollRatio = scrollPosition / scrollSize;

    const position =
      clickPosition > scrollRatio
        ? Math.min(scrollSize, scrollPosition + offsetSize)
        : Math.max(0, scrollPosition - offsetSize);

    updateScrollPosition(scrollNode, position, horizontal);
  }

  function handleStart(e: React.MouseEvent<HTMLDivElement>) {
    const { scrollLeft, scrollTop } = grooveRef.current?.parentNode as HTMLDivElement;
    updateAction({
      isPressX: horizontal,
      isPressY: !horizontal,
      lastScrollTop: scrollTop,
      lastScrollLeft: scrollLeft,
      pressStartX: e.clientX,
      pressStartY: e.clientY,
    });
  }

  return (
    <div
      className={classNames('ms-thumbBar', horizontal ? 'ms-x' : 'ms-y', {
        'ms-active': isPress,
      })}
      onClick={handleThumbBarClick}
      ref={grooveRef}
    >
      <div
        className="ms-thumb"
        onMouseDown={handleStart}
        onClick={(e) => e.stopPropagation()}
        style={{
          [sizeKey]: Math.max((offsetSize / scrollSize) * offsetSize, minThumbSize),
        }}
      />
    </div>
  );
}

export default React.memo(ThumbBar);
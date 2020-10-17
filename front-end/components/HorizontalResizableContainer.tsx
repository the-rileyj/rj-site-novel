import React, { ReactNode, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { AppTheme } from "./Theme/ThemeContext";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

type Props = {
  children?: ReactNode;
  defaultWidth: number;
  minWidth: number;
};

const useHorizonalResizableContainerStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  wrapper: {
    backgroundColor: theme.palette.primary.light,
    display: "flex",
    maxWidth: "100%",
  },
  resizeColumn: {
    backgroundColor: AppTheme.palette.secondary.main,
    height: "100%",
    width: "3px",
  },
  contentWrapper: {
    padding: ".5rem",
  },
}));

const HorizonalResizableContainer: React.FC<Props> = ({
  children,
  defaultWidth,
  minWidth,
}: Props) => {
  const styles = useHorizonalResizableContainerStyles();

  const [adjustedWidth, setAdjustedWidth] = useState(defaultWidth);
  const [columnHovered, setColumnHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isLeft, setIsLeft] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(100 - defaultWidth / 2);

  const handleColumnMouseDrag = (left: boolean) => () => {
    setDragging(true);
    setIsLeft(left);

    if (left) {
      setPreviewWidth((100 - adjustedWidth) / 2);
    } else {
      setPreviewWidth(100 - (100 - adjustedWidth) / 2);
    }
  };

  const handleColumnHover = (left: boolean, val: boolean) => () => {
    // Need to make sure we're not dragging because column position swaps
    // and as a result this will also swap the 'isLeft' value
    if (!dragging) {
      setIsLeft(left);
      setColumnHovered(val);
    }
  };

  const handleUserDragging = (currentTargetRect: DOMRect, pageX: number) => {
    const offsetX = pageX - currentTargetRect.left;

    const newWidth = (offsetX / currentTargetRect.width) * 100;

    let newPreviewWidth = 100 - 2 * (100 - previewWidth);

    if (isLeft) {
      newPreviewWidth = 100 - 2 * newWidth;
    }

    if (!(minWidth <= newPreviewWidth && newPreviewWidth <= 100)) {
      return;
    }

    setPreviewWidth(newWidth);
  };

  const handleDragging = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (dragging) {
      handleUserDragging(
        event.currentTarget.getBoundingClientRect(),
        event.pageX
      );
    }
  };

  const handleTouchDragging = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouch) {
      setIsTouch(true);
    }

    if (dragging) {
      handleUserDragging(
        event.currentTarget.getBoundingClientRect(),
        event.targetTouches[0].clientX
      );
    }
  };

  const handleMouseEndDrag = () => {
    if (dragging) {
      setDragging(false);
      setColumnHovered(false);

      let newAdjustedWidth = 100 - 2 * (100 - previewWidth);

      if (isLeft) {
        newAdjustedWidth = 100 - 2 * previewWidth;
      }

      if (minWidth <= newAdjustedWidth && newAdjustedWidth <= 100) {
        setAdjustedWidth(newAdjustedWidth);
      }
    }
  };

  // Due to touch behavior, need to manually track hover
  // to prevent latent hover styles from persisting
  const columnHoverStyle = {
    backgroundColor: AppTheme.palette.primary.dark,
    cursor: "pointer",
  };

  const colorStyling = dragging
    ? AppTheme.palette.primary.dark
    : AppTheme.palette.secondary.main;

  const resizeColumnStyling: CSSProperties = {
    ...(dragging ? { backgroundColor: AppTheme.palette.primary.dark } : {}),
    position: dragging ? "absolute" : "static",
    top: 0,
  };

  const calcPreviewWidth = isLeft
    ? 100 - 2 * previewWidth - 1
    : 100 - 2 * (100 - previewWidth) - 1;

  let leftColumnOffset = isLeft ? "- 4px" : "+ 1px";

  if (isTouch) {
    leftColumnOffset = isLeft ? "+ 4px" : "- 7px";
  }

  let rightColumnOffset = isLeft ? "+ 1px" : "- 4px";

  if (isTouch) {
    rightColumnOffset = isLeft ? "- 7px" : "+ 4px";
  }

  return (
    <div
      className={styles.container}
      onMouseMove={handleDragging}
      onMouseUp={handleMouseEndDrag}
      onMouseLeave={handleMouseEndDrag}
      onTouchMove={handleTouchDragging}
      onTouchCancel={handleMouseEndDrag}
      onTouchEnd={handleMouseEndDrag}
      style={{ position: dragging ? "relative" : "static" }}
    >
      <div
        className={styles.wrapper}
        style={{
          borderBottom: dragging ? `solid ${colorStyling} 3px` : undefined,
          borderTop: dragging ? `solid ${colorStyling} 3px` : undefined,
          width: dragging
            ? `calc(18px + ${calcPreviewWidth}%)`
            : `calc(${adjustedWidth}%)`,
          userSelect: dragging ? "none" : "auto",
        }}
      >
        <div
          className={styles.resizeColumn}
          onMouseOver={handleColumnHover(true, true)}
          onMouseLeave={handleColumnHover(true, false)}
          onMouseDown={handleColumnMouseDrag(true)}
          onTouchStart={handleColumnMouseDrag(true)}
          style={{
            left: dragging
              ? `calc(${100 - previewWidth}% ${leftColumnOffset})`
              : undefined,
            ...(columnHovered && isLeft ? columnHoverStyle : {}),
            ...resizeColumnStyling,
          }}
        />
        <div
          className={styles.contentWrapper}
          style={{
            borderBottom: dragging ? undefined : `solid ${colorStyling} 3px`,
            borderTop: dragging ? undefined : `solid ${colorStyling} 3px`,
            width: `100%`,
          }}
        >
          {children}
        </div>
        <div
          className={styles.resizeColumn}
          onMouseOver={handleColumnHover(false, true)}
          onMouseLeave={handleColumnHover(false, false)}
          onMouseDown={handleColumnMouseDrag(false)}
          onTouchStart={handleColumnMouseDrag(false)}
          style={{
            left: dragging
              ? `calc(${previewWidth}% ${rightColumnOffset})`
              : undefined,
            ...(columnHovered && !isLeft ? columnHoverStyle : {}),
            ...resizeColumnStyling,
          }}
        />
      </div>
    </div>
  );
};

export default HorizonalResizableContainer;

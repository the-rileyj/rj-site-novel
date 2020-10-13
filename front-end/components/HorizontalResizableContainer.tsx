import React, { ReactNode, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { makeStyles, Theme } from "@material-ui/core";
import { AppTheme } from "./Theme/ThemeContext";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const routes = [
	{ path: "/", text: "Home", footer: true, header: false },
	{ path: "/about", text: "About", footer: true, header: true },
	{ path: "/posts", text: "Blog", footer: true, header: true },
	{ path: "/contact", text: "Contact", footer: true, header: false },
];

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
		"&:hover": {
			backgroundColor: theme.palette.primary.dark,
			cursor: "pointer",
		},
	},
	contentWrapper: {
		padding: ".5rem",
	},
}));

const HorizonalResizableContainer: React.FC<Props> = ({ children, defaultWidth, minWidth }) => {
	const styles = useHorizonalResizableContainerStyles();

	const [adjustedWidth, setAdjustedWidth] = useState(defaultWidth);
	const [dragging, setDragging] = useState(false);
	const [isLeft, setIsLeft] = useState(false);
	const [previewWidth, setPreviewWidth] = useState(100 - defaultWidth / 2)

	const handleColumnMouseDrag = (left: boolean) => () => {
		setDragging(true)
		setIsLeft(left)

		setPreviewWidth((100 - adjustedWidth) / 2)
	}

	const handleDragging = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (dragging) {
			const currentTargetRect = event.currentTarget.getBoundingClientRect();

			const offsetX = event.pageX - currentTargetRect.left;

			const newWidth = offsetX / currentTargetRect.width * 100;

			if ((isLeft && newWidth >= 50 - minWidth / 2) || (!isLeft && newWidth <= 50 + minWidth / 2)) {
				return;
			}

			setPreviewWidth(newWidth);
		}
	}

	const handleMouseEndDrag = () => {
		setDragging(false)

		if (isLeft)
			setAdjustedWidth(100 - 2 * previewWidth - 1)
		else
			setAdjustedWidth(100 - 2 * (100 - previewWidth) - 1)
	}

	const colorStyling = dragging ?  AppTheme.palette.primary.dark : AppTheme.palette.secondary.main

	const resizeColumnStyling: CSSProperties = {
		...(dragging ? {backgroundColor: AppTheme.palette.primary.dark} : {}),
		position: dragging ? "absolute" : "static",
		top: 0,
	}

	// Note, initial pickup on right side is broken

	const calcPreviewWidth = isLeft ? 100 - 2 * previewWidth - 1 : 100 - 2 * (100 - previewWidth) - 1

	return (
		<div className={styles.container} onMouseMove={handleDragging} onMouseUp={handleMouseEndDrag} onMouseLeave={handleMouseEndDrag} style={{ position: "relative" }}>
			<div className={styles.wrapper} style={{ width: `calc(6px + ${dragging ? calcPreviewWidth : adjustedWidth}%)`, borderBottom: `solid ${colorStyling} 3px`, borderTop: `solid ${colorStyling} 3px`, userSelect: dragging ? "none" : "auto" }}>
				{dragging ? (
					<div style={{ width: "3px" }} />
				) : null}
				<div className={styles.resizeColumn} onMouseDown={handleColumnMouseDrag(true)} style={{ left: dragging ? `calc(${100 - previewWidth}% - ${isLeft ? "6px" : "0px"})` : "static", ...resizeColumnStyling }} />
				<div className={styles.contentWrapper} style={{width: `calc(100% - 6px)`}}>
					{children}
				</div>
				<div className={styles.resizeColumn} onMouseDown={handleColumnMouseDrag(false)} style={{ left: dragging ? `calc(${previewWidth}% - ${isLeft ? "0px" : "6px"})` : "static", ...resizeColumnStyling }} />
				{dragging ? (
					<div style={{ width: "3px" }} />
				) : null}
			</div>
		</div>
	);
};

export default HorizonalResizableContainer;

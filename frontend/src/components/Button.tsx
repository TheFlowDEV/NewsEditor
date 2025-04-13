import React, {FunctionComponent} from "react";
import {useSlate} from "slate-react";
import {CustomElement, CustomText} from "../types";
import {isBlockActive, isMarkActive, toggleMark} from "../utils";
import "./button.scss"
import {Transforms, Element, Editor} from "slate";
import { SvgIconComponent } from "@mui/icons-material";
type MBArguments = {
    format: keyof Omit<CustomText, 'text'>;
    icon: SvgIconComponent|FunctionComponent<any>
}
type BBArguments = {
    block: CustomElement['type'];
    icon: SvgIconComponent|FunctionComponent<any>
}
export const MarkButton = ({ format, icon }:MBArguments) => {
    const editor = useSlate()
    const active = isMarkActive(editor,format)
    return (
        <button className={"changeButton"}
            onMouseDown={(event: React.MouseEvent) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <div data-active={active}>{React.createElement(icon)}</div>
        </button>
    )
}
export const BlockButton = ({ block, icon:Icon}:BBArguments) => {
    const editor = useSlate()
    const active = isBlockActive(editor,block)
    const toggleBlock = () => {
        const newProperties: Partial<CustomElement> = {
            type: active ? "paragraph" : block,
        };
        Transforms.setNodes<Element>(editor, newProperties, {
            match: n => Element.isElement(n) && Editor.isBlock(editor, n),
        });
    };

    return (
        <button
            onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock();
            }}
            className={"changeButton"}
        >
            <div data-active={active}><Icon/></div>
        </button>
    );
};
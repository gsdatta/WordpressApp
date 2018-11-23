declare module "react-native-render-html" {
    import * as React from "react";
    import * as ReactNative from "react-native";

    type Renderer = (
        htmlAttribs: any,
        children: any,
        convertedCSSStyles: any,
        passProps: any,
    ) => JSX.Element;

    export default class HTML extends React.PureComponent<{
        renderers?: { [key: string]: Renderer };
        ignoredTags?: string[];
        ignoredStyles?: string[];
        allowedStyles?: string[];
        decodeEntities?: boolean;
        debug?: boolean;
        listsPrefixesRenderers?: { ul?: Renderer; ol?: Renderer };
        ignoreNodesFunction?: (...args: any[]) => any;
        alterData?: (...args: any[]) => any;
        alterChildren?: (...args: any[]) => any;
        alterNode?: (...args: any[]) => any;
        html?: string;
        uri?: string;
        tagsStyles?: { [key: string]: ReactNative.ViewStyle | Array<ReactNative.ViewStyle> };
        classesStyles?: { [key: string]: ReactNative.ViewStyle | Array<ReactNative.ViewStyle> };
        containerStyle?: ReactNative.ViewStyle | Array<ReactNative.ViewStyle>;
        customWrapper?: (...args: any[]) => any;
        onLinkPress?: (...args: any[]) => any;
        onParsed?: (...args: any[]) => any;
        imagesMaxWidth?: number;
        staticContentMaxWidth?: number;
        imagesInitialDimensions?: {
            width?: number;
            height?: number;
        };
        emSize?: number;
        ptSize?: number;
        baseFontStyle?: ReactNative.ViewStyle | Array<ReactNative.ViewStyle>;
        textSelectable?: boolean;
    }> {}
}
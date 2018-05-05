import React from "react";
import SyntaxHighlighter, { registerLanguage } from "react-syntax-highlighter/dist/light";
import { default as style } from 'react-syntax-highlighter/dist/styles/hljs/atom-one-light';

import js from "react-syntax-highlighter/dist/languages/hljs/javascript";
import xml from "react-syntax-highlighter/dist/languages/hljs/xml";
import json from "react-syntax-highlighter/dist/languages/hljs/json";
import cs from "react-syntax-highlighter/dist/languages/hljs/cs";
import cpp from "react-syntax-highlighter/dist/languages/hljs/cpp";

let lang = { json, xml, javascript: js, cs, cpp  };
Object.keys(lang).map(x => registerLanguage(x, lang[x]));

const CodeBlock = ({ children, ...rest }) => <SyntaxHighlighter style={style} {...rest}>{children}</SyntaxHighlighter>

export default CodeBlock;
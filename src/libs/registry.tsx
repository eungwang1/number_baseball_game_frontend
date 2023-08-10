"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = createCache();
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return (
      <>
        {" "}
        <style
          id="antd"
          dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
        />
        {styles}
      </>
    );
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleProvider cache={cache}>
      <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
        {children}
      </StyleSheetManager>
    </StyleProvider>
  );
}

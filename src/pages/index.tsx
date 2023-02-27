import { Conv2d } from "@/components/layers/Conv2d";
import { Input, Output } from "@/components/layers/JustTensor";
import { Sequential } from "@/components/Sequential";
import { Conv2dSize, Tensor } from "@/type/size";
import { assetFullUrl, assetUrl } from "@/utils/config";
import Head from "next/head";
import { useMemo } from "react";

export default function Home() {
  const input = {
    shape: [32, 1, 28, 28],
  } satisfies Tensor<Conv2dSize>;
  const { layer } = Sequential([
    Input<Conv2dSize>,
    Conv2d(
      useMemo(() => ({ in_channels: 1, out_channels: 3, kernel_size: 5 }), [])
    ),
    Conv2d(
      useMemo(() => ({ in_channels: 3, out_channels: 3, kernel_size: 3 }), [])
    ),
    Output<Conv2dSize>,
  ])(input);
  return (
    <>
      <Head>
        <title>ConvNet Shape Calculator</title>
        <meta name="description" content="ConvNet Shape Calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={assetUrl("/favicon.ico")} />
        <meta property="og:image" content={assetFullUrl("/conv.png")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lemolatoon1" />
      </Head>
      <main>
        <h1>ConvNet Shape Calculator</h1>
        {layer}
      </main>
    </>
  );
}

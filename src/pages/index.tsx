import { Conv2d } from "@/components/layers/Conv2d";
import { Conv2dSize, Tensor } from "@/type/size";
import Head from "next/head";

export default function Home() {
  const Conv1 = Conv2d({ in_channels: 1, out_channels: 3, kernel_size: 5 });
  const input = {
    shape: [32, 1, 28, 28],
  } satisfies Tensor<Conv2dSize>;
  return (
    <>
      <Head>
        <title>ConvNet Shape Calculator</title>
        <meta name="description" content="ConvNet Shape Calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>ConvNet Shape Calculator</h1>
        <Conv1 tensor={input}></Conv1>
      </main>
    </>
  );
}

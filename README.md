# Simple Knowledge base

This is a [Amplify Gen2](https://docs.amplify.aws/react/) chat app project based on Nextjs integrating [AWS Bedbrock](https://aws.amazon.com/bedrock) RAG `Retrieval Augmented Generation` as a knowledge base. Think adding you own data to an Ai query!

## Getting Started

First, install npm dependencies:

```bash
npx i
```

Second, deploy the amplify sandbox:

```bash
npx ampx sandbox
```
Third, start the Nextjs dev env:

```bash
npm run dev
```

## OR

Upload the starter csv file and start dev env

```bash
npm run uploadDev
```

This chat app will allow you to query your sample data in the csv. for example `Do you know of any carpenters?` and the LLM will return a response augmented with relevant information from your sample data. The app also allows you to upload a new CSV file via the `manage data` menu.

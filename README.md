This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. **Set Up Supabase Database:** Create a project on [Supabase](https://supabase.com/); the free tier will be sufficient. 
After creating the project, navigate to the SQL Editor on the Supabase client. 
Run the SQL scripts located in `src/db/database_setup.sql` to set up the database schema and tables.

2. **Supabase Connection Configuration:** Ensure that the Supabase connection details are correctly configured in 
`src/db/supabase.ts`. Replace the `supabaseUrl` with the URL provided by Supabase. You'll also need to copy the API Key 
provided by Supabase into the `.env.local` (create one if not available) file as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

    ```ts 
    // .env.local
    NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR API KEY HERE]"
    ```

    ```ts
    // supabase.ts
    const supabaseUrl = "[YOUR SUPABASE URL HERE]";
    ```

3. Finally, run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

6. You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

Other documentations:
- [Supabase Documentation](https://supabase.com/docs) - learn how to setup Supabase through tutorials, APIs and platform resources.
- [Flowbite - Tailwind CSS Component Library](https://flowbite.com/docs/getting-started/introduction/) - get started with
the most popular open-source library of interactive UI components.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Using the Application

#### Registration and Login:

Navigate to the Users page by clicking the "Users" tab in the Navigation bar.
Click on "Register" to create a new account.
Fill in the username and password, then log in using the credentials provided.

#### Setting Permissions:

Upon logging in, users are directed to the Permissions page.
By default, all users are granted all permissions.
Users can update their permissions dynamically on this page.

#### Accessing the Inventory:

Navigate to the Inventory tab to view the product page.
Users must have the "create" permission enabled to create a new product.

#### Product Management:

Click on the "Create Product" button to add a new product.
Fill in the required information and click "Submit."
The page will redirect to the product details page `inventory/[id]` after submission.

#### Product Details Page:

To navigate to the product details page from the table, click on the *Product Name* of any product.<br>

On the product details page, users can update or delete the product.
Updating the product will refresh the page to display the updated details.
Deleting the product will navigate the user back to the Inventory page.

#### Filters and Sorting:

#### *Filters:*
- "More than," "Less than," and Price Value
- Supplier Id

#### *Sorting:*
- "Price Ascending" or "Price Descending"

#### Using Filters:

Users can input any combination of filters and sorting options.
To reset the filters, click on the "Reset Filter" button, then "Filter" to apply the reset.

#### Inventory Seed Generation and Deletion:

To generate or delete data in the Inventory table, users can utilize the "Create Product" component. The following options are available:

##### Generate Product: 

- Clicking on this button will trigger the generation of 1000 data entries. Upon clicking, a confirmation popup will appear. After confirming, the generation process will commence. Please note that generating 1000 data entries may take up to 1 minute to complete. The Inventory table will be updated in real-time as the data is generated.

##### Delete All Products:

- Clicking on this button will delete all existing data in the Inventory table. Similar to the "Generate Product" button, a confirmation popup will appear before executing the deletion process. Upon confirmation, all data in the Inventory table will be permanently removed.

#### *It's important to note that these operations should be performed with caution, as they may have significant consequences on the data stored in the Inventory table.*
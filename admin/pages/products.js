import Layout from "@/components/Layout";
import Link from "next/link";

export default function Products() {
    return (
        <Layout>
            <Link href={'/products/new'} className="btn-primary">Add New Product</Link>
        </Layout>
    )
}
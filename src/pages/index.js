import React from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/seo"
import "../styles/index.scss"
import { graphql, StaticQuery, navigate } from "gatsby"
import BookingForm from "../components/BookingForm";
import Img from "gatsby-image"

const IndexPage = ({ data }) => {
  // console.log(data);
  return (
    <Layout
      // pageInfo={{ pageName: "index" }}
      // lightFooter

    >
      <SEO
        title="Home"
      />

      <div className="pt-32 relative">
        <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden -z-10">
          <Img className="max-h-full" fluid={data.file.childImageSharp.fluid} />
        </div>
        <h1 className="px-4 text-center text-white text-4xl tracking-tight leading-10 font-extrabold text-gray-50 sm:text-5xl sm:leading-none md:text-6xl">Where will we be flying today?</h1>

        <BookingForm onSubmit={(data) => navigate("otherpage", {
          state:data
        })} className="relative" style={{
          bottom: "-7rem",
        }} />
      </div>
    </Layout>
  )
};

export default IndexPage

export const query = graphql`
  query {
    file(relativePath: { eq: "bg_dark.jpg" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fluid(maxWidth: 1920, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
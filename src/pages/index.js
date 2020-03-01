import React, { useMemo, useState } from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/seo"
import "../styles/index.scss"
import { graphql } from "gatsby"
import BookingForm from "../components/BookingForm"
import DynamicBackgroundImage from "../components/DynamicBackgroundImage"

const bgImageCaptions = {
  "PHX": "Phoenix Airport Caption",
  "LAX": "LAX Caption!!"
}

const IndexPage = ({ data }) => {
  const [airport, setAirport] = useState(null)
  const backgroundImages = useMemo(() => {
    return data.images.edges.reduce((acc, cur) => {
      const airportCode = cur.node.relativePath.substring(18, 21)
      acc[airportCode] = cur.node.childImageSharp.fluid
      return acc
    }, {})
  }, data.images);

  return (
    <Layout>
      <SEO
        title="Home"
      />

      <div className="min-h-content-area relative flex items-center justify-center">
        <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden -z-10">
          <DynamicBackgroundImage
            className="h-full"
            images={backgroundImages}
            captions={bgImageCaptions}
            currentImage={airport}
            defaultImage={data.file.childImageSharp.fluid}
            defaultCaption={"Default Caption @jeffrey"} />
        </div>
        <div className="pb-16">
          {/*<h1 className="mb-8 sm:mb-16 px-4 text-center text-white text-4xl tracking-tight leading-10 font-extrabold text-gray-50 sm:text-5xl sm:leading-none md:text-6xl">Coastal Airlines</h1>*/}
          <h1
            className="mb-8 sm:mb-16 px-4 text-center text-white text-4xl leading-10 font-bold text-gray-50 sm:text-5xl sm:leading-none md:text-6xl"
            style={{ textShadow: "0 0 75px black, 0 0 20px rgba(0,0,0,0.7)" }}>Where will we be flying today?</h1>

          <div>
            <BookingForm onAirportSelect={airport => setAirport(airport)}/>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    images: allFile(filter: {absolutePath: {regex: "/(airport_bg_images).*(\\.jpg)/"}}) {
      edges {
        node {
          childImageSharp {
            fluid(maxWidth: 1920, quality: 100) {
              base64
              tracedSVG
              srcWebp
              srcSetWebp
              originalImg
              originalName
              presentationWidth
              presentationHeight
            }
          }
          relativePath
        }
      }
    }
    file(relativePath: { eq: "bg.jpg" }) {
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
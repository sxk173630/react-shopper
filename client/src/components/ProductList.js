import React from "react";
//Library that can make and handle request using the useEffect hook.
import axios from "axios";
//Link component to access links that are displayed using <Link></Link>.
import { Link } from "react-router-dom";
//More concise way to request the data.
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import formatProductPrice from "../utils/formatProductPrice";

export default function ProductList() {
  //UseQuery hook that accepts a key to seperates queries, so reactQuery knows which ones to update/refresh.
  //The arguments in useQuery are: Products and the function that is used to  make the request using axios.
  //.then to resolve the data: res.data.products.
  //Data is returned to us in an object called "products".
  //isLoading property helps us in the process of fetching.
  const { data: products, isLoading } = useQuery('Products', () => axios('/api/products').then((res) => res.data.products));

  if (isLoading) return <LoadingSpinner />;

  //const [products, setProducts] = React.useState([])
  //By using the useEffect Hook, you tell React that your component needs to do something after render.
  //Then include a function with a second argument of an empty array to make sure that it only runs once when the component mounts.
  //Then gets the endpoint and resolves this promise by using a .then callback that gets a response of the products. data.products.(As speficied in routes.js).
  //Then in a second callback, we get the product data and use a react state that is set to an empty array so that we can display them.
  /* React.useEffect(() => {
    axios.get("/api/products")
      .then(res => res.data.products)
      .then(products => setProducts(products))
  }, []); */
  //Reutrns the map of prodcuts by passing down product data as a prop(properties).
  return products.map((product) => (
    <ProductItem key={product.id} product={product} />
  ));
}
//Receiving product data as a prop.(Just like State - an Object which stores the data we want to display, with the difference that the Props can NOT be changed inside the Component receiving them.)
function ProductItem({ product }) {
  //Takes the product and passes in product and returns back the price in the price variable.
  const price = formatProductPrice(product)

  return (
    <div className="p-4 md:w-1/3">
      <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
        <Link to={`/${product.id}`}><img
          className="lg:h-96 md:h-36 w-full object-cover object-center"
          src={product.image}
          alt={product.name}
        />
        </Link>
        <div className="p-6">
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
            {product.category}
          </h2>
          <h1 className="title-font text-lg font-medium text-white mb-3">
            {product.name}
          </h1>
          <p className="leading-relaxed mb-3">{product.description}</p>
          <div className="flex items-center flex-wrap ">
            <Link to={`/${product.id}`}
              className="text-indigo-400 inline-flex items-center md:mb-2 lg:mb-0">
              See More
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </Link>
            <span className="text-gray-500 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-lg pr-3 py-1 border-gray-800 font-bold">
              {price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
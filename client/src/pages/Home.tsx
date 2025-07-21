import axios from "axios";
import { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchListingsStart, fetchListingsSuccess, fetchListingsFailure, removeError } from "../redux/listing/listingSlice";
import PageHeader from "../components/PageHeader";

const Home = () => {

  useEffect(() => {
    document.body.classList.remove('search-bg')
    document.body.classList.add('normal-bg')
  }, [])

  const [numberOfListings, setNumberOfListings] = useState(8);
  const [limitAcheaved, setLimitAcheaved] = useState(false);

  const dispatch = useDispatch();
  const { listings, error, loading } = useSelector((state: any) => state.listings);

  useEffect(() => {
    fetchListings();
  }, [numberOfListings]);

  const fetchListings = async () => {
    dispatch(fetchListingsStart());
    try {
      const res = await axios.get(`api/listing/all?limit=${numberOfListings}`);
      dispatch(fetchListingsSuccess(res.data));
      if (res.data.length < numberOfListings) {
        setLimitAcheaved(true);
        console.log("limit acheaved");
      }

    } catch (error: any) {
      dispatch(fetchListingsFailure(error.message));
      setTimeout(() => {
      dispatch(removeError());}, 3000);
    }
  };

  return (
    <div className="relative">
    <PageHeader pageTitle="Home" />
      
    <div className="container max-w-screen-xl my-4 mx-auto p-2 flex flex-col gap-4">
      {loading && <h1>Loading...</h1>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {listings.map((listing: any) => (
          <div key={listing.id}>
            <ListingCard
              id={listing.id}
              title={listing.title}
              desc={listing.description}
              adress={listing.adress}
              images={listing.images}
              postedBy={listing.postedBy}
              price={listing.price}
              category={listing.category}
              bathrooms={listing.bathroom}
              bedrooms={listing.bedroom}
              furnished={listing.furnished}
              parking={listing.parking}
            />
          </div>
        ))}
        {error && <h1 className="text-red-500 text-xl">{error}</h1>}
      </div>
      <div className="flex justify-center">
        <button 
          disabled={limitAcheaved} 
          onClick={() => setNumberOfListings(numberOfListings + 8)} 
          className="px-8 p-2 border-2 border-gray-700 rounded-full disabled:opacity-25 disabled:cursor-not-allowed"
        >
          Load More
        </button>
      </div>
    </div>
    </div>
  );
};

export default Home;

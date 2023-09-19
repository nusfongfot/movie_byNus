import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import MyNavbar from "./navbar";
import CardsMovie from "./cardMovies";
import axios from "axios";

type Props = {};

export default function HomePage({}: Props) {
  const [movies, setMovies] = useState<any[]>([]);
  const [carts, setCarts] = useState<any[]>([]);

  const getApi = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`
    );
    const newData = data.results.map((item: any) => {
      return {
        ...item,
        price: "0",
      };
    });
    setMovies(newData);
  };
  useEffect(() => {
    getApi();
    const datainLocal = JSON.parse(localStorage.getItem("movies") || "[]");
    if (datainLocal.length > 0) {
      setCarts(datainLocal);
    }
  }, []);
  return (
    <>
      <MyNavbar
        movies={movies}
        setMovies={setMovies}
        setCarts={setCarts}
        carts={carts}
      />
      <Container maxWidth="xl">
        <CardsMovie
          movies={movies}
          setMovies={setMovies}
          setCarts={setCarts}
          carts={carts}
        />
      </Container>
    </>
  );
}

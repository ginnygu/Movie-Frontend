import React, { Component } from "react";
import axios from "axios";
import Axios from "../utils/Axios";

export class MovieDetail extends Component {
  state = {
    Actors: "",
    Awards: "",
    Country: "",
    Plot: "",
    Poster: "",
    Rated: "",
    Ratings: [],
    Title: "",
    imdbID: "",
    isLoading: true,
    telInput: "",
    textareaIput: "",
  };

  async componentDidMount() {
    try {
      let result = await axios.get(
        `https://omdbapi.com/?apikey=6332b1e1&t=${this.props.match.params.movieTitle}`
      );

      this.setState({
        Actors: result.data.Actors,
        Awards: result.data.Awards,
        Country: result.data.Country,
        Plot: result.data.Plot,
        Poster: result.data.Poster,
        Rated: result.data.Rated,
        Ratings: result.data.Ratings,
        Title: result.data.Title,
        imdbID: result.data.imdbID,
        isLoading: false,
      });

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  showMovieDetail = () => {
    return (
      <div style={{ display: "flex" }}>
        <div>
          <img src={this.state.Poster} alt={this.state.Title} />
        </div>
        <div>
          <div>Actors: {this.state.Actors}</div>
          <div>Awards: {this.state.Awards}</div>
          <div>Country: {this.state.Country}</div>
          <div>Plot: {this.state.Plot}</div>
          <div>Poster: {this.state.Poster}</div>
          <div>Rated: {this.state.Rated}</div>
          <div>
            Ratings:{" "}
            {this.state.Ratings.map((item) => {
              return (
                <span key={item.Source}>
                  {item.Source} {item.Value}
                </span>
              );
            })}
          </div>
          <div>Title: {this.state.Title}</div>
          <div>imdbID: {this.state.imdbID}</div>
        </div>
      </div>
    );
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    let parsedPhoneNumber = this.state.telInput.split("-").join("");

    try {
      let message = `
                      ${this.state.textareaIput}
                       Here's the movie details:
                      Actors: ${this.state.Actors}
                      Plot: ${this.state.Plot}
      `;

      // let result = await Axios.post(
      //   "/api/twilio/send-sms",
      //   {
      //     to: parsedPhoneNumber,
      //     message: message,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${window.localStorage.getItem("jwtToken")}`,
      //     },
      //   }
      // );

      let result = await Axios.post("/api/twilio/send-sms", {
        to: parsedPhoneNumber,
        message: message,
      });

      console.log(result);
    } catch (e) {
      console.log(e.response);
    }
  };

  handleFormChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            ...Loading
          </div>
        ) : (
          <div>
            {this.showMovieDetail()}

            <div>
              <form onSubmit={this.handleFormSubmit}>
                <input
                  type="tel"
                  id="telInput"
                  name="telInput"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  required
                  placeholder="enter a friend #"
                  onChange={this.handleFormChange}
                />
                <br />
                <textarea
                  name="textareaIput"
                  onChange={this.handleFormChange}
                ></textarea>
                <br />
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MovieDetail;

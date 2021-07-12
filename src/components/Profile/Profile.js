import React, { Component } from "react";
import { toast } from "react-toastify";

import Axios from "../utils/Axios";

import "./Profile.css";

export class Profile extends Component {
  state = {
    friendFirstName: "",
    friendLastName: "",
    friendMobileNumber: "",
    friendArray: [],
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  };

  componentDidMount() {
    this.handleGetAllFriends();
    this.handleFetchUserInfo();
  }

  handleFetchUserInfo = async () => {
    try {
      let fetchedUserInfo = await Axios.get("/api/user/get-user-info");

      this.setState({
        firstName: fetchedUserInfo.data.payload.firstName,
        lastName: fetchedUserInfo.data.payload.lastName,
        username: fetchedUserInfo.data.payload.username,
        email: fetchedUserInfo.data.payload.email,
      });
    } catch (e) {
      toast.error(e.response.data.payload);
    }
  };

  handleGetAllFriends = async () => {
    try {
      let getAllFriends = await Axios.get("/api/friend/get-all-friends");

      this.setState({
        friendArray: getAllFriends.data.friends,
      });
    } catch (e) {
      toast.error(e.response.data.payload);
    }
  };

  handleOnFriendChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFriendSubmit = async (event) => {
    event.preventDefault();
    try {
      let createdFriend = await Axios.post("/api/friend/create-friend", {
        firstName: this.state.friendFirstName,
        lastName: this.state.friendLastName,
        mobileNumber: this.state.friendMobileNumber,
      });

      this.setState({
        friendFirstName: "",
        friendLastName: "",
        friendMobileNumber: "",
        friendArray: [...this.state.friendArray, createdFriend.data],
      });

      toast.success("Friend Created!");
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.payload);
    }
  };

  handleUserInputOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleUserUpdateSubmit = async (event) => {
    event.preventDefault();

    try {
      let updatedUserProfile = await Axios.put(
        "/api/user/update-user-profile",
        {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          username: this.state.username,
          password: this.state.password,
        }
      );

      if (updatedUserProfile.status === 202) {
        console.log(this.props);
        this.props.handleUserLogout();
        this.props.history.push("/login");
      } else {
        this.setState({
          firstName: updatedUserProfile.data.payload.firstName,
          lastName: updatedUserProfile.data.payload.lastName,
          username: updatedUserProfile.data.payload.username,
        });
      }

      toast.success("Profile Updated");
    } catch (e) {
      toast.error(e.response.data.payload);
    }
  };

  render() {
    return (
      <div>
        <div className="update-container">
          <h3>Update Profile</h3>
          <form onSubmit={this.handleUserUpdateSubmit}>
            <div className="input-div">
              <input
                placeholder="first name"
                value={this.state.firstName}
                name="firstName"
                onChange={this.handleUserInputOnChange}
              />
            </div>

            <div className="input-div">
              <input
                placeholder="last name"
                value={this.state.lastName}
                name="lastName"
                onChange={this.handleUserInputOnChange}
              />
            </div>

            <div className="input-div">
              <input
                placeholder="username"
                value={this.state.username}
                name="username"
                onChange={this.handleUserInputOnChange}
              />
            </div>

            <div className="input-div">
              <input
                placeholder="email"
                defaultValue={this.state.email}
                disabled={true}
              />
            </div>

            <div className="input-div">
              <input
                placeholder="password"
                name="password"
                onChange={this.handleUserInputOnChange}
              />
            </div>
            <div className="button-div">
              <button>Update</button>
            </div>
          </form>
        </div>

        <hr />

        <div className="update-container">
          <h3>Create Friend</h3>
          <form onSubmit={this.handleFriendSubmit}>
            <div className="input-div">
              <input
                placeholder="first name"
                onChange={this.handleOnFriendChange}
                name="friendFirstName"
                value={this.state.friendFirstName}
              />
            </div>

            <div className="input-div">
              <input
                placeholder="last name"
                onChange={this.handleOnFriendChange}
                name="friendLastName"
                value={this.state.friendLastName}
              />
            </div>

            <div className="input-div">
              <input
                placeholder="mobile number"
                onChange={this.handleOnFriendChange}
                name="friendMobileNumber"
                value={this.state.friendMobileNumber}
              />
            </div>

            <div className="button-div">
              <button>Create Friend</button>
            </div>
          </form>
        </div>
        <hr />
        <div className="update-container">
          <table id="friends">
            <thead>
              <tr id="tr">
                <th>first name</th>
                <th>last name</th>
                <th>mobile number</th>
                <th>edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.friendArray.map((friend) => {
                return (
                  <tr key={friend._id}>
                    <td>{friend.firstName} </td>
                    <td>{friend.lastName} </td>
                    <td>{friend.mobileNumber}</td>
                    <td>Edit</td>
                    <td>Delete</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Profile;

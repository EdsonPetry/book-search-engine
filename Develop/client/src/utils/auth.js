import { setContext } from "apollo-link-context";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import decode from "jwt-decode";

class AuthService {
  // create an Apollo Client instance
  client = new ApolloClient({
    link: createHttpLink({
      uri: "/graphql", // Update the URI to your GraphQL API endpoint
    }),
    cache: new InMemoryCache(),
  });

  // get user data
  getProfile() {
    const token = this.getToken();
    if (token) {
      return decode(token);
    }
    return null;
  }

  // check if user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }

  // create an Apollo Link middleware for authentication
  authLink = setContext((_, { headers }) => {
    const token = this.getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
}

export default new AuthService();

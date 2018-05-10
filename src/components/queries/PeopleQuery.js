import React, { Component } from "react";
import { gql } from "apollo-boost"; //formats queries for us
import { Query } from "react-apollo";
//value and invoke it with backticks=>"tagging"; tags have additional functionality
export const GET_PEOPLE = gql`
  {
    people {
      id
      height
      films {
        title
      }
      homeworld {
        name
      }
    }
  }
`;

export default class PeopleQuery extends Component {
  render() {
    return (
      <Query query={GET_PEOPLE}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div>
                <img
                  src="https://media.giphy.com/media/GIEXgLDfghUSQ/giphy.gif"
                  alt="loading"
                />
              </div>
            );
          if (error)
            return (
              <div>
                <img
                  src="http://www.fico.com/en/blogs/wp-content/uploads/2017/03/Lack-of-Data.gif"
                  alt="error"
                />
              </div>
            );
          return <div>{this.props.render(data)}</div>;
        }}
      </Query>
    );
  }
}

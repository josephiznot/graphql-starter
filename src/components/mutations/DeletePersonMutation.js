//replace redux by storing in local storage!
import React from "react";
import { gql } from "apollo-boost"; //structure queries
import { Mutation } from "react-apollo";
import { GET_PEOPLE } from "../queries/PeopleQuery";

export const DELETE_PERSON = gql`
  mutation deletePerson($id: Int!) {
    deletePerson(id: $id)
  }
`;

const DeletePersonMutation = props => {
  return (
    <Mutation
      mutation={DELETE_PERSON}
      update={(cache, { data: { deletePerson } }) => {
        //accessing cache now in order to update
        let { people } = cache.readQuery({ query: GET_PEOPLE });
        //you have to manually update the cache.
        const update = people.filter(val => val.id !== deletePerson);
        cache.writeQuery({
          query: GET_PEOPLE,
          data: { people: update }
        });
      }}
    >
      {/* first argument is mutation */}
      {(deletePerson, { loading, err }) => (
        //  prop.children===>super reusable
        <div>{props.children(loading, err, deletePerson)}</div>
      )}
    </Mutation>
  );
};

export default DeletePersonMutation;

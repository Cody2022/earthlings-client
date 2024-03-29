import React, { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading/Loading";
import VolunteerTransportForm from '../Form/VolunteerTransportForm';
import VolunteerTransportList from '../Form/VolunteerTransportList';
import { Container } from '@mui/system';


export const Volunteer = () => {
  const [rerender, setRerender] = useState(false);
  const { user } = useAuth0();
  const email = user.email;
  const [transportList, setTransportList] = useState();
 
    useEffect(() => {
      const fetchTransportListByEmail = async (email) => {
        let response = await fetch(`/transport/get/${email}`);
        let transportList = await response.json();
        return transportList;
      };
      const getTransportList = async (email) => {
        const fetchedTransportList = await fetchTransportListByEmail(email);
        setTransportList(fetchedTransportList);
      };
      getTransportList(email);
    }, [email, rerender]);

  return (
    <div >
      <Container sytle={{ marginBottom: 5 }}>
        <VolunteerTransportForm rerender={rerender} setRerender={setRerender} />
        {transportList && (
          <VolunteerTransportList
            transportList={transportList}
            rerender={rerender}
            setRerender={setRerender}
          />
        )}
      </Container>
    </div>
  );
};

export default withAuthenticationRequired(Volunteer, {
  onRedirecting: () => <Loading />,
});

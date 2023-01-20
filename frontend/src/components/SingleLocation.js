import React from "react";
import { Devices, StyledLink } from './reusable-components/GlobalStyles';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import googleIcon from "./googleIcon.png"
import user from "reducers/user";

export const SingleLocation = () => {
  const [toggleBookmark, setToggleBookmark] = useState(false)
  const [details, setDetails] = useState([])
  const [idOfUserWhoWantsToGo, SetIdOfUserWhoWantsToGo] = useState([])
  const [idOfUserWhoClickedButton, SetIdOfUserWhoClickedButton] = useState({})
  const accessToken = useSelector((store) => store.user.accessToken);
  const visitorId = useSelector((store) => store.user.id)
  const visitorUsername = useSelector((store) => store.user.username)
  const bookmark = useSelector((store) => store.user.bookmark)
  const { locationId, userId, visitors } = useParams()
  const { id } = useParams()
  const dispatch = useDispatch()

  // this useEffect needs to be here, otherwise tuggar den 1000 gånger i consollen
  useEffect(() => {
    fetch(`https://final-project-m2dbj6puqa-lz.a.run.app/locations/${id}`)
      .then(res => res.json())
      .then((data) => {
        console.log(data.response)
        setDetails(data.response)
        SetIdOfUserWhoWantsToGo(data.response.visitors)
        console.log(data.response.visitors)
      })
      .catch(error => console.error(error))
  }, []);

  const onBookmarkButtonClickCulture = () => {
    // const [iWantToGo, SetIWantToGo] = useState()


    //With useEffect: invalid Hook call. Can´t use useEffect inside an onClick-function
    //Without useEffect: failed to load resource: bad request (400)
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": accessToken
      },
      //Something needed here?
      body: JSON.stringify({ locationId, userId })
    }
    fetch(`https://final-project-m2dbj6puqa-lz.a.run.app/location/${id}/bookmarkCulture/${visitorId}`, options)
      .then(res => res.json())
      .then((data) => {
        // SetIWantToGo(data.response.visitors)
        console.log(data)
        // if (data.success) {
        //   dispatch(user.actions.setBookmark(data.response.bookmark))
        // }
      })
      .catch(error => console.error(error))
  }

  const onBookmarkButtonClickNature = () => {
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": accessToken
      },
      body: JSON.stringify({ locationId, userId })
    }
    fetch(`https://final-project-m2dbj6puqa-lz.a.run.app/location/${id}/bookmarkNature/${visitorId}`, options)
      .then(res => res.json())
      .then((data) => {
           // SetIWantToGo(data.response.visitors)
           console.log(data)
      //   if (data.success) {
      //     dispatch(user.actions.setBookmark(data.bookmark));
      //   } else {
      //     dispatch(user.actions.bookmark(null))
      //   }
      })
      .catch(error => console.error(error))
  }

  const onRemoveCultureBookmarkClick = () => {
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": accessToken
      },
      body: JSON.stringify({ locationId, userId, bookmark })
    }
    fetch(`https://final-project-m2dbj6puqa-lz.a.run.app/location/${id}/deleteBookmarkCulture/${visitorId}`, options)
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(user.actions.setBookmark(data.bookmark));
        } else {
          dispatch(user.actions.bookmark(null))
        }
      })
      .catch(error => console.error(error))
  }

  const onRemoveNatureBookmarkClick = () => {
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": accessToken
      },
      body: JSON.stringify({ locationId, userId, bookmark })
    }
    fetch(`https://final-project-m2dbj6puqa-lz.a.run.app/location/${id}/deleteBookmarkNature/${visitorId}`, options)
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(user.actions.setBookmark(data.bookmark));
        } else {
          dispatch(user.actions.bookmark(null))
        }
      })
      .catch(error => console.error(error))
  }

  //turns object into array to be able to render it an use .includes
  const filteredLocations = Object.keys(details)

  if (filteredLocations.includes("genre")) {
    return (
      <LocationWrapper>
        <SingleLocationName> {details.name} </SingleLocationName>
        <Description>{details.description}</Description>
        <WebSiteLink><Bold>Läs mer på: </Bold><a href={details.website} target="_blank">{details.website}</a></WebSiteLink>
        <SingleLocationDivs>
          <Link to="/locations"><BackLink>Tillbaka</BackLink></Link>
          <SingleLocationDivLeft>
            <Image src={details.img} style={{ width: 220, height: 220 }} alt="picture" />
            <OpeningHours><Bold>Öppettider:</Bold>
              <li><Bold>Måndag:</Bold> {details.opening_hours_mon}</li>
              <li><Bold>Tisdag:</Bold> {details.opening_hours_tue}</li>
              <li><Bold>Onsdag:</Bold> {details.opening_hours_wed}</li>
              <li><Bold>Torsdag:</Bold> {details.opening_hours_thu}</li>
              <li><Bold>Fredag:</Bold> {details.opening_hours_fri}</li>
              <li><Bold>Lördag:</Bold> {details.opening_hours_sat}</li>
              <li><Bold>Söndag:</Bold> {details.opening_hours_sun}</li>
            </OpeningHours>
          </SingleLocationDivLeft>
          <SingleLocationDivMiddle>

            <GoogleLink href={details.googlemap} target="_blank">
              <Image src={googleIcon} style={{ width: 220, height: 220 }} alt="googlemaps icon" />
            </GoogleLink>
            <LocationDetails><Bold>Närmaste station:</Bold> {details.closestStation}</LocationDetails>
            <LocationDetails><Bold>Inträde:</Bold> {details.entranceFee}:- </LocationDetails>
          </SingleLocationDivMiddle>
          <IWantToGoDiv>
            <p>Jag vill gå! </p>
            <Visitor
              type="button"
              onClick={() => onBookmarkButtonClickCulture()}>Klicka här</Visitor>
          </IWantToGoDiv>
          <SingleLocationDivRight>
            <p>Jag vill gå! Kontakta mig ❤️</p>
            {idOfUserWhoWantsToGo.map((people) => (
              <Users><StyledLink to={`/profile/${idOfUserWhoWantsToGo}/visit`}> {people}</StyledLink></Users>
            ))}
            <Visitor
              type="button"
              onClick={() => onRemoveCultureBookmarkClick()}>
              Ta bort mig
            </Visitor>
          </SingleLocationDivRight>
        </SingleLocationDivs>
      </LocationWrapper>
    )
  } else {
    return (
      <LocationWrapper>
        <SingleLocationName> <a href={details.website} target="_blank">{details.name}</a></SingleLocationName>
        <Description>{details.description}</Description>
        <SingleLocationDivs>
          <Link to="/locations"><BackLink>Tillbaka</BackLink></Link>
          <SingleLocationDivLeft>
            <Image src={details.img} style={{ width: 220, height: 220 }} alt="picture" />
            <LocationDetails><Bold>Höjdpunkter:</Bold> {details.highlights}</LocationDetails>
            <LocationDetails><Bold>Aktiviteter:</Bold> {details.activities}</LocationDetails>
          </SingleLocationDivLeft>
          <SingleLocationDivMiddle>
            <GoogleLink href={details.googlemap} target="_blank">
              <Image src={googleIcon} style={{ width: 220, height: 220 }} alt="googlemaps icon" />
            </GoogleLink>
            <LocationDetails><Bold>Närmaste station:</Bold> {details.closestStation}</LocationDetails>
            <LocationDetails><Bold>Tillgång till café:</Bold> {details.cafe} </LocationDetails>
            <LocationDetails><Bold>Tillgång till grillplats:</Bold> {details.barbecuePossibility} </LocationDetails>
            <LocationDetails><Bold>Tillgång till toalett:</Bold> {details.toilet} </LocationDetails>
          </SingleLocationDivMiddle>
          <IWantToGoDiv>
            <p>Jag vill gå!</p>
            <Visitor
              type="button"
              onClick={() => onBookmarkButtonClickNature()}>Klicka här</Visitor>
          </IWantToGoDiv>
          <SingleLocationDivRight>
            <p>Jag vill gå! Kontakta mig ❤️</p>
            {idOfUserWhoWantsToGo.map((people) => (
              <Users><StyledLink to={`/profile/${idOfUserWhoWantsToGo}/visit`}> {people}</StyledLink></Users>
            ))}
            <Visitor
              type="button"
              onClick={() => onRemoveNatureBookmarkClick()}>
              Ta bort mig
            </Visitor>
          </SingleLocationDivRight>
        </SingleLocationDivs>
      </LocationWrapper>
    )
  }
}

const WebSiteLink = styled.p`
  margin-top: 10px;
  text-align: center;
  width: 70%;
`

const SingleLocationName = styled.h1`
  font-family: 'Girassol', cursive;
  font-size: 30px;
  padding: 20px;
  margin: 10px;
  text-decoration: none;
  border-radius: 3px;
  background-color: #FCF8E8;

  @media ${Devices.tablet} {
  font-size: 35px;
  } 

  @media ${Devices.laptop} {
    font-size: 45px;
  }
`

const LocationWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(140deg, #FCF8E8 60%, #ECB390 60%);
  font-family: "montserrat";
`
const SingleLocationDivs = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  margin-bottom: 25px;

@media ${Devices.tablet} {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  } 

  @media ${Devices.laptop} {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 30px;
  }
`

const SingleLocationDivLeft = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  margin-top: 20px;
  align-items: center;
  border-radius: 10px;
  background-color: #FCF8E8;
  border: 2px solid #e8894f;
  box-shadow: 5px 3px 3px #e8894f;

  @media ${Devices.tablet} {
    width: 350px;
  } 

  @media ${Devices.laptop} {
    grid-row-start: 1;
    grid-row-end: 4;
    width: 350px;
  }
`

const SingleLocationDivMiddle = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: #FCF8E8;
  border: 2px solid #e8894f;
  box-shadow: 5px 3px 3px #e8894f;

  @media ${Devices.tablet} {
    width: 350px;
  } 

  @media ${Devices.laptop} {
    grid-row-start: 1;
    grid-row-end: 3;
    width: 350px;
  }
`

const IWantToGoDiv = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  margin-top: 20px;
  align-items: center;
  border-radius: 10px;
  background-color: #FCF8E8;
  border: 2px solid #e8894f;
  box-shadow: 5px 3px 3px #e8894f;

  @media ${Devices.tablet} {
    width: 350px;
  } 

  @media ${Devices.laptop} {
    grid-row-start: 3;
    grid-row-end: 4;
    width: 350px;
  }
`

const SingleLocationDivRight = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  margin-top: 20px;
  align-items: center;
  border-radius: 10px;
  background-color: #FCF8E8;
  border: 2px solid #e8894f;
  box-shadow: 5px 3px 3px #e8894f;
  margin-bottom: 30px;

  @media ${Devices.laptop} {
    width: 350px;
  }

  @media ${Devices.laptop} {
    grid-row-start: 1;
    grid-row-end: 4;
    width: 350px;
  }
`

const Image = styled.img`
  border-radius: 50%;
  margin: 10px;
  border: 2px solid #FCF8E8;

  @media ${Devices.tablet} {
    width: 300px;
  } 

  @media ${Devices.tablet} {
    width: 200px;
    height: 200px;
  } 

`

const Description = styled.p`
  width: 70%;
  padding: 15px;
  text-align: center;
`

const LocationDetails = styled.p`
  font-size: 17px;
  text-align: center;
`

const OpeningHours = styled.ul`
  padding: 10px;
  font-size: 17px;
  border-radius: 5%;
`

const Bold = styled.span`
  font-weight: 600;
  
`
const Users = styled.button`
  padding: 0px, 5px;
  background-color: #CEE5D0;
  border-radius: 5px;
  margin: 2px;
`

const Visitor = styled.button`
  padding: 0px, 5px;
  background-color: #CEE5D0;
  border-radius: 5px;
  width: 100px;
  margin: 2px;
`

const GoogleLink = styled.a`
  &:hover {
  transform: scale(1.1) rotate(0.01deg);
}
`
const BackLink = styled.button`
  padding: 0px, 5px;
  background-color: #CEE5D0;
  border-radius: 5px;
  width: 150px;
  margin: 0px 0px 20px 0px;
  align-self: flex-start;
`
import Hero from "../components/Hero";import Story from "../components/Story";import {Intro,Featured,Locations,Why,About,CTA,Contact} from "../components/Sections";
export default function Home({ready}){return <main><Hero ready={ready}/><Intro/><Featured/><Story/><Locations/><Why/><About/><CTA/><Contact/></main>}

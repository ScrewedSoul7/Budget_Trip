import Hero from "@/components/Hero";
import UserPreferences from "@/components/UserPreferences";

export default function Home() {
  return (
    <>

      <Hero title = 'Explore the world without burning your pocket' subtitle = 'Find the perfect destination that suits your budget and preferences'/>
      <UserPreferences/>
    </>
  );
}

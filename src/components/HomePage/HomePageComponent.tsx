import { GroupComponent } from "../Group/GroupComponent";
import { Header } from "../Header/Header";

import { AuthContext } from "../AuthContext/AuthContext";

export const HomePageComponent = () => {
  return (
    <div className="container mx-auto h-full flex flex flex-col">
      <AuthContext>
        <Header></Header>
        <GroupComponent />
      </AuthContext>
    </div>
  );
};

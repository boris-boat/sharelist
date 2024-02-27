import { GroupComponent } from "../Group/GroupComponent";
import { Header } from "../Header/Header";

import { AuthContext } from "../AuthContext/AuthContext";
import { SettingsModal } from "../SettingsModal/SettingsModal";

export const HomePageComponent = () => {
  return (
    <div className="container mx-auto h-full flex flex-col">
      <AuthContext>
        <Header></Header>
        <GroupComponent />
        <SettingsModal></SettingsModal>
      </AuthContext>
    </div>
  );
};

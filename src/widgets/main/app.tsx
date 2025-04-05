import React, {memo, useEffect, useState} from 'react';
import Toggle from '@jetbrains/ring-ui-built/components/toggle/toggle';
import List from "@jetbrains/ring-ui-built/components/list/list";
import {Type} from "@jetbrains/ring-ui-built/components/list/consts";

// Register widget in YouTrack. To learn more, see https://www.jetbrains.com/help/youtrack/devportal-apps/apps-host-api.html
const host = await YTApp.register();

type Preferences = {
  compact: boolean
}

type Project = {
  id: string,
  name: string,
  description: string | null
}

const AppComponent: React.FunctionComponent = () => {
  const [isCompact, setCompact] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getPreferences();
    getProjects();
  }, [])

  async function getPreferences() {
    const result = await host.fetchApp('backend/preferences', { method: 'GET' });
    const res = result as Preferences;
    setCompact(res.compact);
  }

  async function getProjects() {
    const result = await host.fetchYouTrack('admin/projects', { query: { fields: 'id,name,description' } });
    setProjects(result as Project[]);
  }

  async function updateCompact(newState: boolean) {
    setCompact(newState);
    await host.fetchApp('backend/preferences', { method: 'POST', body: { compact: newState } });
  }

  return (
    <div className="widget">
      <Toggle onChange={() => updateCompact(!isCompact)} checked={isCompact}>Compact</Toggle>
      <List data={
              projects.map((p) => ({
                label: p.name,
                details: isCompact ? null : p.description,
                description: isCompact ? p.description : null,
                rgItemType: Type.ITEM
              }))
            }
      />
    </div>
  );
};

export const App = memo(AppComponent);

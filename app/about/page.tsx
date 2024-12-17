'use client';

import React, { useEffect, useState } from 'react';

const AboutPage = () => {
  const [repos, setRepos] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch('https://api.github.com/users/simoneraffaelli/repos');
      const data = await response.json();
      setRepos(data);
    };

    fetchRepos();
  }, []);

  return (
    <div>
      <h1>About Me</h1>
      <p>Welcome to the About Me page. Here you can learn more about me.</p>
      <h2>My GitHub Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutPage;

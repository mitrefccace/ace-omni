import React, { useEffect } from 'react';

/**
 * Placeholder for testing login responses, create users, and passwords
 */
function Study() {
  useEffect(() => {
    // Put any functions we want to run when the component loads here
  }, []);

  async function testLogin() {
    const response = await fetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testUser', strPword: 'omniPassword123!' }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const data = await response.json();
    console.log(`DATA ${JSON.stringify(data)}`);
  }

  async function testLoginBad() {
    const response = await fetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testUser', strPword: 'NotMe' }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const data = await response.json();
    console.log(`DATA ${JSON.stringify(data)}`);
  }

  async function testUsernameBad() {
    const response = await fetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'NotMe', strPword: 'omniPassword123!' }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const data = await response.json();
    console.log(`DATA ${JSON.stringify(data)}`);
  }

  async function testCreate() {
    const response = await fetch('/users/addUser', {
      method: 'POST',
      body: JSON.stringify(
        {
          username: 'testUser',
          strPword: 'omniPassword123!',
          role: 'System Administrator',
          firstName: 'Test',
          lastName: 'Omni'
        }
      ),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const data = await response.json();
    console.log(`DATA ${JSON.stringify(data)}`);
  }

  return (
    <main>
      <button type="button">Create template2</button>
      <button type="button" onClick={() => testLogin()}>Test Login</button>
      <button type="button" onClick={() => testCreate()}>Test Create</button>
      <a href="/sandbox">Go to sandbox</a>
      <p>Test Templates</p>
      <a href="/exp/test">test</a><br />
      <a href="/exp/abc">test2</a><br />
      <a href="/exp/unknown">test3</a>
      <button type="button" onClick={() => testLogin()}>Test Login</button>
      <button type="button" onClick={() => testUsernameBad()}>Test Bad Username Login</button>
      <button type="button" onClick={() => testLoginBad()}>Test Bad Password Login</button>
    </main>
  );
}

export default Study;

import userEvent from '@testing-library/user-event';
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setName('');
    setLastName('');
  };

  const baseUrl =
    'https://8d518a2b-f7ff-4dfa-97aa-87241ff142f3.id.repl.co/guests/';
  useEffect(() => {
    setIsLoading(true);
    async function fetchGuest() {
      const response = await fetch(baseUrl);
      const allGuests = await response.json();
      setIsLoading(false);
      setGuests(allGuests);
    }
    fetchGuest().catch((err) => {
      console.log(err);
    });
  }, []);
  async function getNewGuest() {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: name, lastName: lastName }),
    });
    const createdGuest = await response.json();

    setGuests([...guests, createdGuest]);
  }

  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    setGuests(guests.filter((guest) => guest.id !== deletedGuest.id));
  }
  async function attendingGuest(id, checkStatus) {
    const response = await fetch(`${baseUrl}${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: checkStatus }),
    });
    const updatedGuest = await response.json();

    setGuests(
      guests.map((guest) =>
        guest.id === updatedGuest.id ? updatedGuest : guest,
      ),
    );
  }
  return (
    <div data-test-id="guest">
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label>
            first name
            <input
              value={name}
              disabled={isLoading}
              onChange={(event) => {
                setName(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <label>
            last name
            <input
              value={lastName}
              disabled={isLoading}
              onChange={(event) => {
                setLastName(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <button
            onClick={async () => {
              await getNewGuest();
              handleClick();
            }}
          >
            return
          </button>
          <br />
        </form>
      )}
      {guests.map((guest) => {
        return (
          <div data-test-id="guest" key={`guest_${guest.id}`}>
            <span>{guest.firstName} </span>
            <span>{guest.lastName} </span>
            <button
              onClick={async () => {
                await deleteGuest(guest.id);
              }}
            >
              remove
            </button>
            <label>
              <input
                checked={guest.attending}
                type="checkbox"
                aria-label="attending"
                onChange={async (event) => {
                  const checkStatus = event.currentTarget.checked;
                  await attendingGuest(guest.id, checkStatus);
                }}
              />
              {guest.attending ? 'attending' : 'not attending'}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default App;

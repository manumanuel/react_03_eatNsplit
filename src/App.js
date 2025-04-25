import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friendList, setFriendList] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleAddFriend() {
    setShowAddFriend((prev) => !prev);
  }

  function handleAddFriendToList({ friend }) {
    setFriendList((prev) => [...prev, friend]);
    setShowAddFriend((prev) => !prev);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friendList} />
        {showAddFriend && (
          <AddFriendToList onAddFriend={handleAddFriendToList} />
        )}
        <Button onClick={handleAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      <SplitBill />
    </div>
  );
}

function FriendsList({ friends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3> {friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button>select</Button>
    </li>
  );
}

function AddFriendToList({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    e.preventDefault();
    if (!name || !image) {
      alert("Please fill all the fields");
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    console.log(newFriend);
    onAddFriend({ friend: newFriend });
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        value={name}
        required
        onChange={(el) => setName(el.target.value)}
      />
      <label htmlFor="image">Image URL</label>
      <input
        type="text"
        id="image"
        value={image}
        required
        onChange={(el) => setImage(el.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with your x friends</h2>

      <label htmlFor="bill">Bill value</label>
      <input type="text" id="bill" required />

      <label htmlFor="myExp">Your expense</label>
      <input type="text" id="myExp" required />

      <label htmlFor="frExp">X's expense</label>
      <input type="text" id="frExp" required disabled />

      <label htmlFor="bill">Who is paying the bill</label>
      <select>
        <option value="user">You</option>
        <option value="friend">Friend</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

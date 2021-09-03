const { roomModel, massageModel } = require("../models/chat");

module.exports = (io) => {
  io.on("connection", (socket) => {
    // socket.emit("connection", { id: socket.id });
    //get all rooms of a user by user id
    socket.on("getRooms", ({ uid }) => {
      socket.join(uid);
      roomModel
        .find({ partners: { $in: [uid] } })
        .sort({ lastMassageTime: "desc" })
        .exec((err, data) => {
          if (err) throw err;

          socket.emit("getAllRooms", {
            rooms: data,
          });
        });
    });
    // Get room id of two persons
    socket.on("getRoomId", ({ userId, otherId }) => {
      roomModel
        .find({ partners: { $all: [userId, otherId] } })
        .exec((err, data) => {
          if (err) throw err;
          if (data.length) socket.emit("roomPresent", { roomId: data[0]._id });
          else {
            roomModel.create(
              {
                partners: [userId, otherId],
                lastMassage: "",
                lastMassgeTime: 0,
              },
              (err2, data2) => {
                if (err2) throw err2;
                io.to(otherId).emit("newRoomAdded", { newRoom: data2 });
                socket.emit("roomPresent", { roomId: data2._id });
              }
            );
          }
        });
    });

    //join chat room
    socket.on("joinChatRoom", ({ roomId }) => {
      socket.join(roomId);
    });
    //get room detail by room id
    socket.on("getRoom", ({ roomId }) => {
      roomModel.find({ _id: roomId }).exec((err, data) => {
        if (err) throw err;
        socket.emit("getRoomResult", { room: data[0] });
      });
    });
    // get all chat of room by room id
    socket.on("getAllchats", ({ roomId }) => {
      socket.join(roomId);
      massageModel
        .find({ roomId: roomId })
        .sort({ time: "desc" })
        .exec((err, data) => {
          if (err) throw err;
          socket.emit("allMassages", { massages: data });
        });
    });
    //send massage to other partner
    socket.on(
      "sendMassage",
      ({ roomId, massage, senderId, senderName, senderPic }) => {
        const time = Date.now();
        const massageToSave = {
          roomId: roomId,
          massage: massage,
          doerId: senderId,
          doerName: senderName,
          doerPic: senderPic,
          time: time,
        };
        massageModel.create(massageToSave, (err, data) => {
          if (err) throw err;
          roomModel.updateOne(
            { _id: roomId },
            { lastMassage: massage, lastMassageTime: time },
            (err3, data3) => {
              if (err3) throw err3;
              io.to(roomId).emit("newMassage", { newMassage: data });
              io.to(roomId).emit("lastMassageUpdated", {
                lastMassage: massage,
                lastMassageTime: time,
              });
            }
          );
        });
      }
    );
  });
};

// chat-sidebar.js : 사이드바 담당
import {
  createChatRoom,
  getChatRoomList,
  getChatLogs,
  deleteChatRoom,
  renameChatRoom,
} from './api.js';
import ChatApp from './chat-app.js';

let chatApp = null;

export async function loadChatRooms() {
  const chatroomList = document.getElementById('chatroom-list');
  chatroomList.innerHTML = '';

  try {
    const rooms = await getChatRoomList();

    rooms.forEach(room => {
      const item = document.createElement('div');
      item.className = 'chatroom-item';
      item.dataset.id = room.id;

      const titleSpan = document.createElement('span');
      titleSpan.textContent = room.title;
      titleSpan.classList.add('chatroom-title');

      const editBtn = document.createElement('button');
      editBtn.className = 'edit-chat-btn';
      editBtn.textContent = '✏️';

      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        const input = document.createElement('input');
        input.type = 'text';
        input.value = room.title;
        input.className = 'edit-chat-input';

        titleSpan.style.display = 'none';
        item.insertBefore(input, editBtn);
        input.focus();

        let isEditing = false;

        const finishEdit = async (isSave) => {
          if (isEditing) return;
          isEditing = true;

          input.remove();
          titleSpan.style.display = 'inline';

          if (!isSave) return;

          const newTitle = input.value.trim();
          if (newTitle && newTitle !== room.title) {
            try {
              await renameChatRoom(room.id, newTitle);
              await loadChatRooms();
            } catch (err) {
              alert('채팅방 이름 수정에 실패했습니다.');
            }
          }
        };

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') finishEdit(true);
          if (e.key === 'Escape') finishEdit(false);
        });

        input.addEventListener('blur', () => finishEdit(false));
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-chat-btn';
      deleteBtn.textContent = '×';
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const confirmDelete = confirm(`"${room.title}" 채팅방을 삭제하시겠습니까?`);
        if (!confirmDelete) return;

        try {
          await deleteChatRoom(room.id);
          if (chatApp && chatApp.currentRoomId === room.id) {
            document.getElementById('chat-messages').innerHTML = '';
            chatApp = null;
          }
          await loadChatRooms();
        } catch (err) {
          alert('채팅방 삭제에 실패했습니다.');
        }
      });

      item.addEventListener('click', async () => {
        localStorage.setItem('last_room_id', room.id);

        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';

        const logs = await getChatLogs(room.id);

        document.querySelectorAll('.chatroom-item').forEach(el => {
          el.classList.remove('active');
        });
        item.classList.add('active');

        if (window.chatApp) {
          window.chatApp.reset();
          await window.chatApp.init(room);
        } else {
          window.chatApp = new ChatApp();
          await window.chatApp.init(room);
        }

        window.chatApp.currentRoomId = room.id;
        window.chatApp.renderer.addBotMessageInitial('안녕하세요! 무엇을 도와드릴까요?');
        logs.forEach(log => {
          if (log.role === 'user') {
            window.chatApp.renderer.addUserMessage(log.message);
          } else {
            window.chatApp.renderer.addBotMessageInitial(log.message);
          }
        });
      });

      item.appendChild(titleSpan);
      item.appendChild(editBtn);
      item.appendChild(deleteBtn);
      chatroomList.appendChild(item);

      if (window.chatApp && window.chatApp.currentRoomId === room.id) {
        item.classList.add('active');
      }
    });
  } catch (error) {
    console.error('채팅방 목록 로딩 실패:', error);
  }
}

export async function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggle-sidebar');
  const chatMain = document.querySelector('.chatbot-main');
  const sidebarContainer = document.querySelector('.sidebar-container');
  const newChatBtn = document.getElementById('new-chat-btn');

  // 사이드바 시작 상태: 열림
  sidebar.classList.add('open');
  chatMain.classList.remove('centered');
  sidebarContainer.style.display = 'block';

  toggleBtn.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');

    if (isOpen) {
      chatMain.classList.remove('centered');
      sidebarContainer.style.display = 'block';
    } else {
      chatMain.classList.add('centered');
      sidebarContainer.style.display = 'none';
    }
  });

  newChatBtn.addEventListener('click', async () => {
    try {
      const room = await createChatRoom();
      localStorage.setItem('last_room_id', room.id);

      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = '';

      if (window.chatApp) {
        window.chatApp.reset();
      } else {
        window.chatApp = new ChatApp();
      }

      window.chatApp.currentRoomId = room.id;
      window.chatApp.renderer.addBotMessageInitial('안녕하세요! 무엇을 도와드릴까요?');

      await loadChatRooms();
    } catch (error) {
      console.error('새 채팅방 생성 실패:', error);
    }
  });

  await loadChatRooms();

  // 마지막 사용한 채팅방 자동 클릭
  const lastRoomId = localStorage.getItem('last_room_id');
  if (lastRoomId) {
    const item = [...document.querySelectorAll('.chatroom-item')]
      .find(el => el.dataset.id === lastRoomId);

    if (item) {
      item.click();
    }
  }
}

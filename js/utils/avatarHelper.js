/**
 * AvatarHelper: Shared Utility for Rendering & Managing User Avatars
 * Supports:
 * - Image Uploads (Base64 data URLs)
 * - Remote Image URLs
 * - Cute Student Emojis with Custom Gradients
 * - Initial Letters with Custom Gradients
 */
export const AVATAR_GRADIENTS = [
  { id: 'peach', name: 'Cam đào', value: 'linear-gradient(135deg, #F5B28D 0%, #F4B5C2 100%)' },
  { id: 'lavender', name: 'Xanh dương tím', value: 'linear-gradient(135deg, #AFC8F5 0%, #C7B7F4 100%)' },
  { id: 'emerald', name: 'Xanh ngọc', value: 'linear-gradient(135deg, #A9DED5 0%, #6EE7B7 100%)' },
  { id: 'amber', name: 'Vàng mật ong', value: 'linear-gradient(135deg, #F7D99A 0%, #F5B28D 100%)' },
  { id: 'indigo', name: 'Tím Indigo', value: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)' },
  { id: 'midnight', name: 'Xanh Midnight', value: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)' },
  { id: 'rose', name: 'Hồng Rose', value: 'linear-gradient(135deg, #FB7185 0%, #FDA4AF 100%)' }
];

export const AVATAR_EMOJI_GROUPS = [
  {
    title: '🎓 Học sinh & Sinh viên',
    emojis: ['🎓', '👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '🧑‍🔬', '👩‍🏫', '🧑‍🎓']
  },
  {
    title: '🐾 Linh vật Cute',
    emojis: ['🐱', '🐶', '🦊', '🐼', '🐨', '🐰', '🦁', '🐯', '🦉', '🦄']
  },
  {
    title: '⚡ Năng động & Sáng tạo',
    emojis: ['🚀', '⚡', '☕', '🎧', '📚', '🎨', '🌟', '🎯', '💡', '🔥']
  }
];

export const AvatarHelper = {
  renderAvatarHtml(user = {}, size = 40, extraClass = '') {
    const isTHPT = user?.mode === 'high_school';
    const avatarVal = user?.avatar || (isTHPT ? 'UV' : 'TH');
    const gradient = user?.avatarGradient || (isTHPT ? 'linear-gradient(135deg, #F4B5C2 0%, #F5B28D 100%)' : 'linear-gradient(135deg, #AFC8F5 0%, #C7B7F4 100%)');

    // Case 1: Image URL or Base64 Data URL
    if (typeof avatarVal === 'string' && (avatarVal.startsWith('data:image/') || avatarVal.startsWith('http://') || avatarVal.startsWith('https://'))) {
      return `
        <div class="user-avatar ${extraClass}" style="width: ${size}px; height: ${size}px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid var(--color-glass-border); flex-shrink: 0;">
          <img src="${avatarVal}" alt="${user.name || 'Avatar'}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `;
    }

    // Case 2: Emoji or Short Initials
    const isEmoji = typeof avatarVal === 'string' && /\p{Extended_Pictographic}/u.test(avatarVal);
    const fontSize = isEmoji ? `${size * 0.55}px` : `${Math.max(11, size * 0.38)}px`;

    return `
      <div class="user-avatar ${extraClass}" style="width: ${size}px; height: ${size}px; border-radius: 50%; background: ${gradient}; display: flex; align-items: center; justify-content: center; font-size: ${fontSize}; font-weight: 700; color: ${isEmoji ? 'inherit' : '#1F2937'}; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid var(--color-glass-border); flex-shrink: 0; user-select: none;">
        ${avatarVal}
      </div>
    `;
  },

  getInitialsFromName(name = '') {
    if (!name || !name.trim()) return 'ST';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
  }
};

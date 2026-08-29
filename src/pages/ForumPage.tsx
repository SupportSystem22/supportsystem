import React, { useState } from 'react';
import { PageView, LanguageMode, ForumPost, ForumReply } from '../types';
import { initialForumPosts } from '../data/forumData';
import { BrandLogo } from '../components/BrandLogo';
import { mentorData } from '../data/mentorData';
import {
  Users,
  MessageSquare,
  Heart,
  ShieldCheck,
  Plus,
  Filter,
  Sparkles,
  Award,
  Send,
  X,
  Lock,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

interface ForumPageProps {
  onNavigate: (page: PageView) => void;
  lang: LanguageMode;
  onOpenCrisis: () => void;
}

export const ForumPage: React.FC<ForumPageProps> = ({
  onNavigate,
  lang,
  onOpenCrisis,
}) => {
  const [posts, setPosts] = useState<ForumPost[]>(initialForumPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<string>('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // New post form
  const [newPost, setNewPost] = useState({
    alias: 'QuietWanderer',
    ageGroup: 'Young Adult (18-25)' as ForumPost['ageGroup'],
    category: 'Stress & Overthinking' as ForumPost['category'],
    title: '',
    content: '',
    isTriggerWarning: false,
    triggerNote: '',
  });

  const categories = [
    'All',
    'Stress & Overthinking',
    'Life Direction',
    'Career Confusion',
    'Relationships',
    'Finding Clarity',
    'Personal Growth',
  ];

  const aliasSuggestions = [
    'QuietWanderer',
    'GentleRiver',
    'BraveBreeze',
    'StarlitSeeker',
    'CalmHorizon',
    'MorningSparrow',
  ];

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.hasLiked;
          return {
            ...p,
            hasLiked: !hasLiked,
            likesCount: hasLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddReply = (postId: string) => {
    if (!replyInput.trim()) return;

    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      authorAlias: 'FellowSeeker (You)',
      isMentor: false,
      content: replyInput.trim(),
      createdAt: 'Just now',
      likesCount: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            repliesCount: p.repliesCount + 1,
            replies: [...p.replies, newReply],
          };
        }
        return p;
      })
    );

    setReplyInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const created: ForumPost = {
      id: `post-${Date.now()}`,
      authorAlias: newPost.alias || 'AnonymousSeeker',
      authorAvatarId: 'avatar-user',
      ageGroup: newPost.ageGroup,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      category: newPost.category,
      likesCount: 1,
      hasLiked: true,
      repliesCount: 0,
      replies: [],
      createdAt: 'Just now',
      isTriggerWarning: newPost.isTriggerWarning,
      triggerNote: newPost.triggerNote,
    };

    setPosts([created, ...posts]);
    setIsComposerOpen(false);
    setNewPost({
      alias: 'QuietWanderer',
      ageGroup: 'Young Adult (18-25)',
      category: 'Stress & Overthinking',
      title: '',
      content: '',
      isTriggerWarning: false,
      triggerNote: '',
    });
  };

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <div id="forum-page-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Forum Header */}
      <div className="rounded-3xl bg-[#f5eee4] border border-[#e5dcce] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#dc3c1c] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Lock className="w-3 h-3" /> Anonymous Safe Haven
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1a18]">
            Community Reflections & Discussions
          </h1>
          <p className="text-xs sm:text-sm text-[#5a5249] max-w-xl">
            A gentle, judgment-free space to ask questions, vent personal struggles, and share perspectives under a chosen alias.
          </p>
        </div>

        <button
          id="open-forum-composer-btn"
          onClick={() => setIsComposerOpen(true)}
          className="px-6 py-3.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Share Thoughts Anonymously</span>
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1 pl-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#22201e] text-white shadow-sm'
                : 'bg-white border border-[#e5dcce] text-[#554e46] hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Community Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isExpanded = activePostId === post.id;
          return (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-[#ebdccb] p-6 space-y-4 hover:border-[#dc3c1c]/40 transition-all shadow-sm"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#f4ece0] text-[#dc3c1c] font-bold text-xs flex items-center justify-center">
                    {post.authorAlias.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1c1a18]">@{post.authorAlias}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f4efe5] text-[#5e554c] font-medium">
                        {post.ageGroup}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">{post.createdAt}</span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-[#dc3c1c] bg-[#fff2ef] px-2.5 py-1 rounded-full border border-[#ffe0d8]">
                  {post.category}
                </span>
              </div>

              {/* Title & Content */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#1c1a18] leading-snug">{post.title}</h3>
                <p className="text-xs sm:text-sm text-[#4d453d] leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Action Buttons (Like & Reply Counter) */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.hasLiked
                        ? 'bg-[#fff0ed] text-[#dc3c1c]'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-[#dc3c1c]' : ''}`} />
                    <span>{post.likesCount} Support</span>
                  </button>

                  <button
                    onClick={() => setActivePostId(isExpanded ? null : post.id)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.repliesCount} Responses</span>
                  </button>
                </div>

                <button
                  onClick={() => setActivePostId(isExpanded ? null : post.id)}
                  className="text-xs font-semibold text-[#dc3c1c] hover:underline"
                >
                  {isExpanded ? 'Hide Responses' : 'View Mentor Insights & Replies →'}
                </button>
              </div>

              {/* Expanded Replies Section */}
              {isExpanded && (
                <div className="pt-4 border-t border-stone-100 space-y-4 animate-fadeIn">
                  <div className="space-y-3">
                    {post.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-2xl text-xs sm:text-sm space-y-1.5 ${
                          reply.isMentor
                            ? 'bg-[#fff7f5] border border-[#ffcfc3] shadow-sm'
                            : 'bg-[#faf7f2] border border-[#ede5d8]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {reply.isMentor && (
                              <div className="w-5 h-5 rounded-full overflow-hidden border border-[#dc3c1c] flex-shrink-0">
                                <img
                                  src={mentorData.avatarUrl}
                                  alt={mentorData.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <span className={`font-bold ${reply.isMentor ? 'text-[#dc3c1c]' : 'text-stone-800'}`}>
                              {reply.authorAlias}
                            </span>
                            {reply.isMentor && (
                              <span className="px-2 py-0.5 rounded-full bg-[#dc3c1c] text-white text-[9px] font-extrabold flex items-center gap-1">
                                <Award className="w-2.5 h-2.5" /> Verified Mentor
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">{reply.createdAt}</span>
                        </div>
                        <p className="text-[#3c3630] leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Reply Input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write a supportive reply or reflection..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-[#fdfbf8] focus:border-[#dc3c1c] focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddReply(post.id)}
                      className="px-4 py-2 rounded-xl bg-[#22201e] hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Anonymous Post Composer Modal */}
      {isComposerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsComposerOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#dc3c1c]/10 text-[#dc3c1c] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#1c1a18]">Share Thoughts Anonymously</h3>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Pick a Pseudonym / Alias:</label>
                  <input
                    type="text"
                    required
                    value={newPost.alias}
                    onChange={(e) => setNewPost({ ...newPost, alias: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:border-[#dc3c1c]"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aliasSuggestions.slice(0, 3).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setNewPost({ ...newPost, alias: a })}
                        className="text-[10px] text-stone-500 hover:text-[#dc3c1c]"
                      >
                        @{a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Age Group:</label>
                  <select
                    value={newPost.ageGroup}
                    onChange={(e) => setNewPost({ ...newPost, ageGroup: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:border-[#dc3c1c]"
                  >
                    <option value="Teen (12-17)">Teen (12-17)</option>
                    <option value="Young Adult (18-25)">Young Adult (18-25)</option>
                    <option value="Adult (26+)">Adult (26+)</option>
                    <option value="Anonymous">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Topic Category:</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:border-[#dc3c1c]"
                >
                  <option value="Stress & Overthinking">Stress & Overthinking</option>
                  <option value="Life Direction">Life Direction</option>
                  <option value="Career Confusion">Career Confusion</option>
                  <option value="Relationships">Relationships</option>
                  <option value="Finding Clarity">Finding Clarity</option>
                  <option value="Personal Growth">Personal Growth</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Question or Subject Line *:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do I stop feeling like I’m running out of time at 21?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:border-[#dc3c1c]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Story / Thoughts *:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write freely. No names or personal contact numbers are allowed in public posts..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-300 bg-[#faf8f5] focus:outline-none focus:border-[#dc3c1c]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#dc3c1c] hover:bg-[#c23214] text-white font-bold shadow cursor-pointer"
                >
                  Post to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

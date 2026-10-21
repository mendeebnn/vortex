import React from 'react';
import { Instagram, ArrowUpRight, Heart, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreInstagramSection: React.FC = () => {
  const { storefrontConfig } = useApp();

  const posts = [
    {
      id: 'ig-1',
      image: '/src/assets/images/hero_votex_winter_campaign_1792328359846.jpg',
      caption: 'SUB-ZERO 2026 Collection — tested down to -25°C in the streets of Ulaanbaatar. Limited batch drop.',
      likes: '1,420',
      comments: '88',
      tag: '#votex_brand_',
    },
    {
      id: 'ig-2',
      image: '/src/assets/images/product_sneaker_polar_black_1792328359882.jpg',
      caption: 'Polar-Grip Thermo Sneaker: Thick thermal fleece lining & ice-traction tread outsole.',
      likes: '960',
      comments: '42',
      tag: 'Хүйтэнд тэсвэртэй',
    },
    {
      id: 'ig-3',
      image: '/src/assets/images/product_jacket_turkish_parka_1792328361082.jpg',
      caption: 'Turkish Imported heavy tactical kurtik with sealed storm hood. 24-48h courier delivery.',
      likes: '1,180',
      comments: '64',
      tag: 'Хүргэлт үнэгүй',
    },
    {
      id: 'ig-4',
      image: '/src/assets/images/product_sneaker_polar_cream_1792328360477.jpg',
      caption: 'Alpine Sherpa High-Top in Oatmeal Sand. DM us or call hotline 8808-3734 to place orders.',
      likes: '850',
      comments: '31',
      tag: '#winterfashion',
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-b border-[#E5E5E5] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono font-medium text-[#737373] tracking-widest uppercase mb-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>OFFICIAL INSTAGRAM COMMUNITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] font-brand">
              @{storefrontConfig.instagramHandle}
            </h2>
          </div>

          <a
            href={storefrontConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] hover:border-[#0A0A0A] text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors self-start sm:self-auto"
          >
            <span>Follow on Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4-Image Feed Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={storefrontConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-[#F7F7F7] border border-[#E5E5E5] overflow-hidden block"
            >
              <img
                src={post.image}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white text-xs">
                <span className="font-mono text-[10px] tracking-wider uppercase text-neutral-300">
                  {post.tag}
                </span>
                <p className="line-clamp-3 text-[11px] leading-relaxed text-neutral-200">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between font-mono text-[11px] pt-2 border-t border-white/20">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

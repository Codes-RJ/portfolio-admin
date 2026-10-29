import { SiteText } from '../ui/SiteText';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useContentSlice } from '../../context/contentSubscriptions';

export function WritingResearchSection() {
  const blogPosts = useContentSlice('blogPosts');
  const researchPapers = useContentSlice('researchPapers');
  const article = blogPosts[0];
  const paper = researchPapers[0];

  return (
    <section id="home-notes" className="editorial-notes">
      <div className="editorial-notes__inner">
        <div className="editorial-notes__heading">
          <p className="editorial-section-label"><span>06</span><SiteText id="WritingResearchSection.fd9aa3cf718f">{" / NOTES & EXPLORATIONS"}</SiteText></p>
          <h2><SiteText id="WritingResearchSection.15db1f6a35dc">{"Thinking out loud"}</SiteText><span>.</span></h2>
          <p><SiteText id="WritingResearchSection.154cdc9be5cd">{"Writing and research belong beside the finished work: they show the questions, tradeoffs, and lessons along the way."}</SiteText></p>
        </div>
        <div className="editorial-notes__grid">
          <div className="editorial-notes__item">
            <span className="editorial-notes__type"><SiteText id="WritingResearchSection.c088c7aa368d">{"WRITING / 01"}</SiteText></span>
            <h3>{article?.title || 'Writing will appear here.'}</h3>
            <p>{article?.summary || 'Build notes and technical articles are being prepared.'}</p>
            <Link to={article ? '/blog/' + article.slug : '/blog'}><SiteText id="WritingResearchSection.d3f73dc4eb7b">{"Read writing "}</SiteText><ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="editorial-notes__item">
            <span className="editorial-notes__type"><SiteText id="WritingResearchSection.c23b8f0099a3">{"RESEARCH / 02"}</SiteText></span>
            <h3>{paper?.title || 'Research will appear here.'}</h3>
            <p>{paper?.abstract || 'Experiments and research notes are being prepared.'}</p>
            <Link to="/research"><SiteText id="WritingResearchSection.24877dc660e0">{"Explore research "}</SiteText><ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
        {(article || paper) && <p className="editorial-notes__note"><SiteText id="WritingResearchSection.e2335e129579">{"Design preview: writing and research entries are sample content."}</SiteText></p>}
      </div>
    </section>
  );
}

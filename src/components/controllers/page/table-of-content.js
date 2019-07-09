import { h, Component } from 'preact';
import cx from '../../../lib/cx';
import style from './table-of-contents.less';

export default class Toc extends Component {
	toggle = () => {
		this.setState({ open: !this.state.open });
		return false;
	};

	open = () => this.setState({ open: true });

	componentDidMount() {
		if ('IntersectionObserver' in window) {
			let config = {
				root: null,
				threshold: 1,
				rootMargin: '0px'
			};

			this.observer = new IntersectionObserver(entries => {
				let active = [];
				entries.forEach(entry => {
					let id = entry.target.getAttribute('id');
					let link = this.props.items.find(link => link.id === id);
					if (link && entry.isIntersecting && entry.intersectionRatio >= 0.75) {
						active.push(id);
					}
				});

				if (active.length > 0) {
					this.setState({ active: active[0] });
				}
			}, config);

			Array.prototype.slice.call(document.querySelectorAll('content-region h2'))
				.forEach(heading => this.observer.observe(heading));
		}
	}

	componentWillUnmount() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	render({ items }, { open }) {
		return (
			<div class={cx(style.toc, !(items && items.length>1) && style.disabled)} open={open}>
				<button class={style.toggle} onClick={this.toggle}>Table of Contents🔗</button>
				<nav tabIndex="0" onFocus={this.open}>
					{items.map(({ text, level, id }) => (
						<a href={'#' + id} class={this.state.active===id ? style.active : undefined}><span class={style.linkInner}>{ text }</span></a>
					))}
				</nav>
			</div>
		);
	}
}

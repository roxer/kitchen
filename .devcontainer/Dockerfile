# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=3.4.7
FROM ghcr.io/rails/devcontainer/images/ruby:$RUBY_VERSION

SHELL ["/bin/bash", "-c"]
# Install mise version manager
# ENV MISE_DATA_DIR="~/mise"
# ENV MISE_CONFIG_DIR="~/mise"

# RUN curl https:/mise plugins ls/mise.run | /bin/bash && \
# 		echo 'eval "$(mise activate bash)"' >> ~/.bashrc && \
#     echo 'eval "$(mise activate bash)"' >> ~/.profile

# ENV PATH="~/.local/bin:$PATH"

# # Activate mise in the same RUN command to ensure it's available
# RUN eval "$(mise activate bash)"

# RUN mise install nodejs@24.11.0 && \
# 		mise use --global nodejs@24.11.0

# # Install Yarn Berry
# RUN npm i -g corepack
# RUN corepack enable
# RUN corepack prepare yarn --activate


# Ensure binding is always 0.0.0.0
# Binds the server to all IP addresses of the container, so it can be accessed from outside the container.
ENV BINDING="0.0.0.0"
